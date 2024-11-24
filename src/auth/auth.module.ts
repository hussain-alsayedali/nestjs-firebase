// auth.module.ts
import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './strategys';
import { FirebaseAuthGuard, RolesGuard } from './guards';

import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { UserAuthService } from './user/user-auth.service';
import { AdminAuthService } from './admin/admin-auth.service';
import { UsersController } from 'src/users/users.controller';
import { AdminAuthController } from './admin/admin-auth.controller';
import { UserAuthController } from './user/user-auth.controller';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'firebase-auth' }),
    HttpModule,
  ],
  controllers: [AuthController, AdminAuthController, UserAuthController],
  providers: [
    FirebaseAuthStrategy,
    UserAuthService,
    AdminAuthService,
    AuthService,
  ],
  exports: [PassportModule],
})
export class AuthModule {}
