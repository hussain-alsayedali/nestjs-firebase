import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { GetUser, Roles } from 'src/auth/decorator';
import { CreateTodoDto, EditTodoDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { FirebaseAuthGuard, RolesGuard } from 'src/auth/guards';

@Controller('todo')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Post('/create')
  @Roles('user')
  createTodo(@GetUser() user, @Body() dto: CreateTodoDto) {
    console.log(dto);
    console.log('todo User', user);
    return this.todoService.createTodo(dto, user.uid);
  }

  @Post('/edit/:id')
  @Roles('user')
  editTodo(
    @GetUser() user,
    @Body() dto: EditTodoDto,
    @Param('id') todoId: string,
  ) {
    return this.todoService.editTodo(todoId, dto, user.uid);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Roles('user')
  deleteTodoUser(@GetUser() user, @Param('id') todoId: string) {
    return this.todoService.deleteTodo(user.uid, todoId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('admin-delete/:id')
  @Roles('admin')
  deleteTodoAdmin(@GetUser() user, @Param('id') todoId: string) {
    console.log(user);
    return this.todoService.adminDeleteTodo(todoId);
  }
}
