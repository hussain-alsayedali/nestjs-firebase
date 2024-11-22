import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import { FirebaseService } from './firebase.service';

@Injectable()
export class FirebaseRepository {
  db: FirebaseFirestore.Firestore;
  users: FirebaseFirestore.CollectionReference;
  admins: FirebaseFirestore.CollectionReference;
  todos: FirebaseFirestore.CollectionReference;

  constructor(private firebaseApp: FirebaseService) {
    this.db = this.firebaseApp.getFirestore();
    this.users = this.db.collection('users');
    this.todos = this.db.collection('todos');
    this.admins = this.db.collection('admins');
  }
}
