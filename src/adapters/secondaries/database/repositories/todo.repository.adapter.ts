import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { Repository } from 'typeorm';
import TodoEntity from '../../../../domain/entities/todo.entity';
import { TodosPort } from '../../../../domain/ports/todos.port';
import AddTodoUsecaseRequest from '../../../../domain/usecases/addTodo/addTodo.usecaserequest';
import RemoveTodoUsecaseRequest from '../../../../domain/usecases/removeTodo/removeTodo.usecaserequest';
import TodoDBEntity from '../entities/todo.typeorm.entity';

@Injectable()
export default class TodoRepositoryAdapter implements TodosPort {
  constructor(
    @InjectRepository(TodoDBEntity)
    private readonly todoRepository: Repository<TodoDBEntity>,
  ) {}
  async addTodo(request: AddTodoUsecaseRequest): Promise<TodoEntity | Error> {
    const todoToCreate = this.todoRepository.create({ title: request.title });
    try {
      const createdTodo: TodoDBEntity = await this.todoRepository.save(
        todoToCreate,
      );
      return new TodoEntity(createdTodo.id, createdTodo.title);
    } catch (error) {
      return Promise.resolve(error);
    }
  }
  async removeTodo(request: RemoveTodoUsecaseRequest): Promise<void | Error> {
    try {
      await this.todoRepository.delete(request.todoId);
      return;
    } catch (error) {
      return Promise.resolve(error);
    }
  }
  async getAllTodos(): Promise<TodoEntity[] | Error> {
    try {
      const response: TodoDBEntity[] = await this.todoRepository.find();
      return response.map((item) => new TodoEntity(item.id, item.title));
    } catch (error) {
      return Promise.resolve(error);
    }
  }
}
