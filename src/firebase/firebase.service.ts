import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  firebaseApp: admin.app.App;
  firebaseConfig: admin.ServiceAccount;
  constructor(private configService: ConfigService) {
    this.firebaseConfig = {
      type: this.configService.get<string>('TYPE'),
      projectId: this.configService.get<string>('PROJECT_ID'),
      private_key_id: this.configService.get<string>('PRIVATE_KEY_ID'),
      private_key: this.configService
        .get<string>('PRIVATE_KEY')
        .replace(/\\n/g, '\n'),
      client_email: this.configService.get<string>('CLIENT_EMAIL'),
      client_id: this.configService.get<string>('CLIENT_ID'),
      auth_uri: this.configService.get<string>('AUTH_URI'),
      token_uri: this.configService.get<string>('TOKEN_URI'),
      auth_provider_x509_cert_url:
        this.configService.get<string>('AUTH_CERT_URL'),
      client_x509_cert_url: this.configService.get<string>('CLIENT_CERT_URL'),
      universe_domain: this.configService.get<string>('UNIVERSAL_DOMAIN'),
    } as admin.ServiceAccount;

    if (admin.apps.length === 0) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(this.firebaseConfig),
        databaseURL: `https://${this.firebaseConfig.projectId}.firebaseio.com`,
        storageBucket: `${this.firebaseConfig.projectId}.appspot.com`,
      });
    } else {
      this.firebaseApp = admin.app();
    }
  }

  getFirestore(): admin.firestore.Firestore {
    if (!this.firebaseApp) {
      throw new Error('Firebase app is not initialized');
    }
    return this.firebaseApp.firestore();
  }

  getAuth(): admin.auth.Auth {
    if (!this.firebaseApp) {
      throw new Error('Firebase app is not initialized');
    }
    return this.firebaseApp.auth();
  }
  getURLSignIn() {
    const apiKey = this.configService.get<string>('WEB_API_KEY');
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    return url;
  }
}
