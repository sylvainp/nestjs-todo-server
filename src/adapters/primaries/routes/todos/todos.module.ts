import { Module } from '@nestjs/common';
import AddTodoUsecase from '../../../../domain/usecases/addTodo/addTodo.usecase';
import { GetAllTodosUsecase } from '../../../../domain/usecases/getAllTodos/getAllTodos.usecase';
import TodosController from './todos.controller';
import RemoveTodoUsecase from '../../../../domain/usecases/removeTodo/removeTodo.usecase';
import { TodosPortInjectorName } from '../../../../domain/ports/todos.port';
import TodoRepositoryAdapter from '../../../secondaries/database/repositories/todo/todo.repository.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import TodoDBEntity from '../../../secondaries/database/entities/todo.typeorm.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../passport/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoDBEntity]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  providers: [
    JwtStrategy,
    AddTodoUsecase,
    GetAllTodosUsecase,
    RemoveTodoUsecase,
    { provide: TodosPortInjectorName, useClass: TodoRepositoryAdapter },
  ],
  controllers: [TodosController],
  exports: [],
})
export class TodosModule {}
