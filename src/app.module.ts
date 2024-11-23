import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admins.module';
import { RouterModule } from '@nestjs/core';
@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    FirebaseModule,
    UsersModule,
    AuthModule,
    AdminModule,
    RouterModule.register([
      {
        path: 'auth',
        module: AuthModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
