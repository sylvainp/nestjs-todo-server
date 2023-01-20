import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import TodoEntity from '../../../../domain/entities/todo.entity';
import AddTodoUsecase from '../../../../domain/usecases/addTodo/addTodo.usecase';
import AddTodoUsecaseRequest from '../../../../domain/usecases/addTodo/addTodo.usecaserequest';
import { GetAllTodosUsecase } from '../../../../domain/usecases/getAllTodos/getAllTodos.usecase';
import { MarkTodoDoneUsecase } from '../../../../domain/usecases/markTodoDone/markTodoDone.usecase';
import { MarkTodoDoneUsecaseRequest } from '../../../../domain/usecases/markTodoDone/marlTodoDone.usecaserequest';
import RemoveTodoUsecase from '../../../../domain/usecases/removeTodo/removeTodo.usecase';
import UsecaseResponse from '../../../../domain/usecases/usecase.response';
import { ControllerResponse } from '../controller.response';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@Controller('todos')
export default class TodosController {
  constructor(
    private readonly addTodoUsecase: AddTodoUsecase,
    private readonly getAllTodosUsecase: GetAllTodosUsecase,
    private readonly removeTodoUsecase: RemoveTodoUsecase,
    private readonly markTodoDoneUsecase: MarkTodoDoneUsecase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addTodo(
    @Body() request: AddTodoUsecaseRequest,
  ): Promise<ControllerResponse> {
    const response = await this.addTodoUsecase.call(request);
    if (response.error) {
      throw new HttpException('plop', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { data: response.data };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTodos(): Promise<ControllerResponse> {
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
  async removeTodo(@Param('id') todoId: string): Promise<ControllerResponse> {
    const response: UsecaseResponse<void> = await this.removeTodoUsecase.call({
      todoId,
    });
    if (response.error) {
      throw new HttpException(response.error.message, HttpStatus.NOT_FOUND);
    }
    // return;
    return { data: null };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('markDone')
  async markTodoDone(
    @Body() request: MarkTodoDoneUsecaseRequest,
  ): Promise<ControllerResponse> {
    if (
      !request ||
      request.todoId === undefined ||
      request.done === undefined
    ) {
      console.error({ request });
      throw new HttpException('Missing params', HttpStatus.BAD_REQUEST);
    }
    const response: UsecaseResponse<TodoEntity> =
      await this.markTodoDoneUsecase.call(request);
    if (response.error) {
      throw new HttpException(response.error.message, HttpStatus.NOT_FOUND);
    }
    return { data: response.data };
  }
}
