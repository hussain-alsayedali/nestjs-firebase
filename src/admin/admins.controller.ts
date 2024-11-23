import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admins.service';
import { FirebaseAuthGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorator';

@Controller('admins')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  @UseGuards(FirebaseAuthGuard)
  @Roles('admin')
  getAllAdmins() {
    return this.adminService.getAllAdmins();
  }
}
