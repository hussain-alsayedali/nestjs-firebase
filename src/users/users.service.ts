import { Injectable } from '@nestjs/common';
import { FirebaseRepository } from 'src/firebase/firebase.repo';

@Injectable()
export class UsersService {
  constructor(private firestore: FirebaseRepository) {}

  async getUsers() {
    const snapshot = await this.firestore.users.get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}
