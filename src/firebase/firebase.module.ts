import { Global, Module } from '@nestjs/common';
import { FirebaseController } from './firebase.controller';
import { FirebaseService } from './firebase.service';
import { FirebaseRepository } from './firebase.repo';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [HttpModule],
  controllers: [FirebaseController],
  providers: [FirebaseService, FirebaseRepository],
  exports: [FirebaseRepository, FirebaseService],
})
export class FirebaseModule {}
