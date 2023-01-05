import { Injectable } from '@nestjs/common';
import TodoInMemoryModel from './model/todo.inmemory.model';
import { randomUUID } from 'crypto';
import { TodosPort } from '../../../domain/ports/todos.port';
import TodoEntity from '../../../domain/entities/todo.entity';
import AddTodoUsecaseRequest from '../../../domain/usecases/addTodo/addTodo.usecaserequest';
import RemoveTodoUsecaseRequest from '../../../domain/usecases/removeTodo/removeTodo.usecaserequest';

@Injectable()
export default class InMemoryAdapter implements TodosPort {
  private _data: TodoInMemoryModel[] = [];

  async removeTodo(params: RemoveTodoUsecaseRequest): Promise<void | Error> {
    const todoToRemove = this._data.find((item) => item.id === params.todoId);
    if (todoToRemove) {
      this._data = this._data.filter((item) => item.id !== params.todoId);
      return Promise.resolve();
    }
    return Promise.resolve(new Error(`no todo with id ${params.todoId} found`));
  }

  async addTodo(params: AddTodoUsecaseRequest): Promise<TodoEntity | Error> {
    const todomodel: TodoInMemoryModel = {
      id: randomUUID(),
      text: params.title,
    };
    this._data.push(todomodel);
    return this.convertToDomain(todomodel);
  }

  async getAllTodos(): Promise<TodoEntity[] | Error> {
    return this._data.map((item) => this.convertToDomain(item));
  }

  private convertToDomain(model: TodoInMemoryModel): TodoEntity | null {
    if (model === null || model === undefined) {
      return null;
    }
    return new TodoEntity(model.id, model.text);
  }
}
