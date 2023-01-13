import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import TodoEntity from '../../../../domain/entities/todo.entity';
import AddTodoUsecase from '../../../../domain/usecases/addTodo/addTodo.usecase';
import AddTodoUsecaseRequest from '../../../../domain/usecases/addTodo/addTodo.usecaserequest';
import { GetAllTodosUsecase } from '../../../../domain/usecases/getAllTodos/getAllTodos.usecase';
import RemoveTodoUsecase from '../../../../domain/usecases/removeTodo/removeTodo.usecase';
import UsecaseResponse from '../../../../domain/usecases/usecase.response';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@Controller('todos')
export default class TodosController {
  constructor(
    private readonly addTodoUsecase: AddTodoUsecase,
    private readonly getAllTodosUsecase: GetAllTodosUsecase,
    private readonly removeTodoUsecase: RemoveTodoUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addTodo(@Body() request: AddTodoUsecaseRequest) {
    const response = await this.addTodoUsecase.call(request);
    if (response.error) {
      throw new HttpException('plop', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { data: response.data };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTodos() {
    const response: UsecaseResponse<TodoEntity[]> =
      await this.getAllTodosUsecase.call();
    if (response.error) {
      throw new HttpException(
        response.error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: response.error },
      );
    }
    return { data: response.data };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeTodo(@Param('id') todoId: string) {
    const response: UsecaseResponse<void> = await this.removeTodoUsecase.call({
      todoId,
    });
    if (response.error) {
      throw new HttpException(response.error.message, HttpStatus.NOT_FOUND);
    }
    return;
    // return {data:}
  }
}
