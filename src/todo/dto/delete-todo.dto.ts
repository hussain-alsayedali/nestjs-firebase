import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeleteTodoDto {
  @IsString()
  @IsNotEmpty()
  uid: string;
}
