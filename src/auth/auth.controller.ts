import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninAdminDto, SignupAdminDto } from './dto';

@Controller('admin')
export class AuthController {
  constructor(private authService: AuthService) {}
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
