import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { SignupAdminDto } from './dto';
import * as admin from 'firebase-admin';
@Injectable()
export class AuthService {
  constructor(private firebaseService: FirebaseService) {}

  async signup(dto: SignupAdminDto) {
    const { email, password } = dto;

    try {
      // Create the user in Firebase
      const userRecord = await this.firebaseService.getAuth().createUser({
        email,
        password,
      });
      await this.firebaseService
        .getFirestore()
        .collection('admins')
        .doc(userRecord.uid)
        .set({
          email,
          role: 'admin',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      // Set custom claims for the user to indicate admin role
      await this.firebaseService
        .getAuth()
        .setCustomUserClaims(userRecord.uid, { role: 'admin' });

      return { message: 'Admin user created successfully', user: userRecord };
    } catch (error) {
      throw new Error(`Error creating admin user: ${error.message}`);
    }
  }
}
