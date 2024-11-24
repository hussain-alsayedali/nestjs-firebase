import { Body, Controller, Post } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { SigninAdminDto, SignupAdminDto } from '../dto';

@Controller('admin')
export class AdminAuthController {
  constructor(private authService: AdminAuthService) {}
  @Post('signup')
  signup(@Body() dto: SignupAdminDto) {
    console.log('reached heree');
    return this.authService.signup(dto);
  }
  @Post('signin')
  signin(@Body() dto: SigninAdminDto) {
    console.log('hmm');
    return this.authService.signin(dto);
  }
}
