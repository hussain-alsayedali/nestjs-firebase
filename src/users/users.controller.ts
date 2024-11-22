import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get()
  getMe() {
    console.log('reached here');
    return this.userService.getUsers();
    console.log('reached their');
  }
}
