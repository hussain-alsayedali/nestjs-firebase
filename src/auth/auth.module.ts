// auth.module.ts
import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './strategys';
import { FirebaseAuthGuard, RolesGuard } from './guards';

import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'firebase-auth' }),
    HttpModule,
  ],
  providers: [
    FirebaseAuthStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: FirebaseAuthGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
    AuthService,
  ],
  exports: [PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}
