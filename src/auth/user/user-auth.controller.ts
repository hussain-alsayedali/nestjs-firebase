import { Body, Controller, Post } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { SigninUserDto, SignupUserDto } from '../dto';

@Controller('user')
export class UserAuthController {
  constructor(private authService: UserAuthService) {}
  @Post('signup')
  signup(@Body() dto: SignupUserDto) {
    console.log('reached heree');
    return this.authService.signup(dto);
  }
  @Post('signin')
  signin(@Body() dto: SigninUserDto) {
    console.log('hmm');
    return this.authService.signin(dto);
  }
}