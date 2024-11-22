import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  firebaseApp: admin.app.App;

  constructor(private configService: ConfigService) {
    const firebaseConfig = {
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

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
      storageBucket: `${firebaseConfig.projectId}.appspot.com`,
    });
  }
  getFirestore(): admin.firestore.Firestore {
    return this.firebaseApp.firestore();
  }
  getAuth(): admin.auth.Auth {
    return this.firebaseApp.auth();
  }
}
