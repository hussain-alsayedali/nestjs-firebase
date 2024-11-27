import { Body, Controller, Post } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { SigninAdminDto, SignupAdminDto } from '../dto';

@Controller('admin')
export class AdminAuthController {
  constructor(private authService: AdminAuthService) {}
  @Post('signup')
  signup(@Body() dto: SignupAdminDto) {
    return this.authService.signup(dto);
  }
  @Post('signin')
  signin(@Body() dto: SigninAdminDto) {
    return this.authService.signin(dto);
  }
}
