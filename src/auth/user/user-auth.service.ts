import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { SignupUserDto, SigninUserDto } from '../dto';
import * as admin from 'firebase-admin';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as argon2 from 'argon2';
import { FirebaseRepository } from 'src/firebase/firebase.repo';
@Injectable()
export class UserAuthService {
  constructor(
    private firebaseService: FirebaseService,
    private httpService: HttpService,
    private firebaseRepo: FirebaseRepository,
  ) {}

  async signup(dto: SignupUserDto) {
    const { email, password, firstName, lastName } = dto;

    try {
      // Create the user in Firebase
      const userRecord = await this.firebaseService.getAuth().createUser({
        email: email,
        password: password,
      });
      const hash = await argon2.hash(password);
      await this.firebaseRepo.users.doc(userRecord.uid).set({
        email,
        password: hash,
        firstName: firstName,
        lastName: lastName,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      // Set custom claims for the user to indicate user role
      await this.firebaseService
        .getAuth()
        .setCustomUserClaims(userRecord.uid, { role: 'user' });

      const firebaseVerifyUrl = this.firebaseService.getURLSignIn();

      const response = await lastValueFrom(
        this.httpService.post(firebaseVerifyUrl, {
          email: dto.email,
          password: dto.password,
          returnSecureToken: true,
        }),
      );

      const { idToken } = response.data;

      return {
        message: 'User user created successfully',
        idToken: idToken,
      };
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        throw new HttpException(
          'The email address is already in use by another account.',
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          `Error creating admin user: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
  async signin(dto: SigninUserDto) {
    try {
      const firebaseVerifyUrl = this.firebaseService.getURLSignIn();

      const response = await lastValueFrom(
        this.httpService.post(firebaseVerifyUrl, {
          email: dto.email,
          password: dto.password,
          returnSecureToken: true,
        }),
      );

      const { idToken, localId } = response.data;

      // Retrieve custom claims or additional user info if needed
      const userRecord = await this.firebaseService.getAuth().getUser(localId);

      return {
        message: 'user signed in successfully',
        token: idToken,
        user: userRecord,
      };
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        const errorCode = error.response.data.error.message;
        if (errorCode === 'EMAIL_NOT_FOUND') {
          throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
        } else if (errorCode === 'INVALID_PASSWORD') {
          throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
        } else if (errorCode === 'USER_DISABLED') {
          throw new HttpException(
            'User account is disabled',
            HttpStatus.FORBIDDEN,
          );
        } else if (errorCode === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
          throw new HttpException(
            'Too many attempts, try again later',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        } else {
          throw new HttpException(
            `Error signing in: ${errorCode}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw new HttpException(
        `Error signing in: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
