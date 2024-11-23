import { Injectable } from '@nestjs/common';
import { FirebaseRepository } from 'src/firebase/firebase.repo';

@Injectable()
export class AdminService {
  constructor(private firebaseFireStore: FirebaseRepository) {}

  async getAllAdmins() {
    const snapshot = await this.firebaseFireStore.admins.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}
