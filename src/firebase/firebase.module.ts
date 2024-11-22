import { Global, Module } from '@nestjs/common';
import { FirebaseController } from './firebase.controller';
import { FirebaseService } from './firebase.service';
import { FirebaseRepository } from './firebase.repo';

@Global()
@Module({
  controllers: [FirebaseController],
  providers: [FirebaseService, FirebaseRepository],
  exports: [FirebaseRepository],
})
export class FirebaseModule {}
