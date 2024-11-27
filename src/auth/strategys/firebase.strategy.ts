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

      const userRole = decodedToken.role;

      const userDoc = await this.firebaseService
        .getFirestore()
        .collection(userRole)
        .doc(decodedToken.uid)
        .get();

      const userData = userDoc.data();

      // Combine user data and decoded token into one object
      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: userRole,
        ...userData, // Include additional user data from Firestore
        decodedToken,
      };
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
