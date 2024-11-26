import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as admin from 'firebase-admin';
import { Strategy } from 'passport-custom';
import { FirebaseRepository } from 'src/firebase/firebase.repo';

import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  constructor(
    private firebaseService: FirebaseService,
    private firebaseRepo: FirebaseRepository,
  ) {
    super();
  }

  async validate(request: any): Promise<any> {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const decodedToken = await this.firebaseService
        .getAuth()
        .verifyIdToken(token);
      console.log(decodedToken);
      const userRole = decodedToken.role;
      console.log(userRole);

      const user = await this.firebaseService
        .getFirestore()
        .collection(userRole)
        .doc(decodedToken.uid)
        .get();

      return { user: user, decodedToken: decodedToken };
    } catch (error) {
      return null;
    }
  }

  authenticate(req: any) {
    this.validate(req)
      .then((user) => {
        if (user) {
          this.success(user);
        } else {
          this.fail('Unauthorized', 401);
        }
      })
      .catch((error) => {
        this.error(error);
      });
  }
}
