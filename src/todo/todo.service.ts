import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseRepository } from 'src/firebase/firebase.repo';
import { CreateTodoDto, DeleteTodoDto, EditTodoDto } from './dto';
import * as admin from 'firebase-admin';
@Injectable()
export class TodoService {
  constructor(private firebaseRepo: FirebaseRepository) {}

  async createTodo(dto: CreateTodoDto, userId: string) {
    const currentTime = admin.firestore.Timestamp.now();
    const todoData = {
      ...dto,
      userId: `/users/${userId}`,
      updatedAt: currentTime,
      createdAt: currentTime,
    };

    const todoRef = await this.firebaseRepo.todos.add(todoData);

    return {
      id: todoRef.id,
      ...todoData,
    };
  }

  async editTodo(todoId: string, dto: EditTodoDto, userId: string) {
    const todoDoc = await this.firebaseRepo.todos.doc(todoId).get();
    if (!todoDoc.exists) {
      throw new UnauthorizedException('Todo not found');
    }

    const todo = todoDoc.data();
    if (todo.userId !== `/users/${userId}`) {
      throw new UnauthorizedException(
        'You are not authorized to edit this todo',
      );
    }

    return this.firebaseRepo.todos.doc(todoId).update({
      ...dto,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  async deleteTodo(userId: string, todoId: string) {
    console.log(todoId);
    const todoDoc = await this.firebaseRepo.todos.doc(todoId).get();
    if (!todoDoc.exists) {
      throw new UnauthorizedException('Todo not found');
    }

    const todo = todoDoc.data();
    if (todo.userId !== `/users/${userId}`) {
      throw new UnauthorizedException(
        'You are not authorized to delete this todo',
      );
    }

    await this.firebaseRepo.todos.doc(todoId).delete();
    return { message: 'Todo deleted successfully' };
  }

  async adminDeleteTodo(todoId: string) {
    const todoDoc = await this.firebaseRepo.todos.doc(todoId).get();
    if (!todoDoc.exists) {
      throw new UnauthorizedException('Todo not found');
    }
    await this.firebaseRepo.todos.doc(todoId).delete();
    return { message: 'Todo deleted successfully' };
  }
}
