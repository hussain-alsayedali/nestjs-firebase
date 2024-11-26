// auth.module.ts
import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './strategys';
import { FirebaseAuthGuard, RolesGuard } from './guards';

import { APP_GUARD } from '@nestjs/core';

import { HttpModule } from '@nestjs/axios';
import { UserAuthService } from './user/user-auth.service';
import { AdminAuthService } from './admin/admin-auth.service';

import { AdminAuthController } from './admin/admin-auth.controller';
import { UserAuthController } from './user/user-auth.controller';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'firebase-auth' }),
    HttpModule,
  ],
  controllers: [AdminAuthController, UserAuthController],
  providers: [FirebaseAuthStrategy, UserAuthService, AdminAuthService],
  exports: [PassportModule],
})
export class AuthModule {}
