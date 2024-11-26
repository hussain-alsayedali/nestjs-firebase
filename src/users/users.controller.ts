import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { FirebaseAuthGuard, RolesGuard } from 'src/auth/guards';
import { GetUser, Roles } from 'src/auth/decorator';

@UseGuards(FirebaseAuthGuard, RolesGuard)
@Roles('user')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getMe(@GetUser() user) {
    console.log('get user decorator', user);
    return this.userService.getUsers();
  }
}
