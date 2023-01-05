import { Module } from '@nestjs/common';
import InMemoryAdapter from '../../../secondaries/InMemory/inMemory.adapter';
import AddTodoUsecase from '../../../../domain/usecases/addTodo/addTodo.usecase';
import { GetAllTodosUsecase } from '../../../../domain/usecases/getAllTodos/getAllTodos.usecase';
import TodosController from './todos.controller';
import RemoveTodoUsecase from '../../../../domain/usecases/removeTodo/removeTodo.usecase';
import { TodosPortInjectorName } from '../../../../domain/ports/todos.port';
import TodoRepositoryAdapter from '../../../secondaries/database/repositories/todo.repository.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import TodoDBEntity from '../../../secondaries/database/entities/todo.typeorm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoDBEntity])],
  providers: [
    AddTodoUsecase,
    GetAllTodosUsecase,
    RemoveTodoUsecase,
    { provide: TodosPortInjectorName, useClass: TodoRepositoryAdapter },
  ],
  controllers: [TodosController],
  exports: [],
})
export class TodosModule {}
