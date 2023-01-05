import { Inject, Injectable } from '@nestjs/common';
import Usecase from '../usecase';
import UsecaseResponse from '../usecase.response';
import TodoEntity from '../../entities/todo.entity';
import AddTodoUsecaseRequest from './addTodo.usecaserequest';
import { TodosPort, TodosPortInjectorName } from '../../ports/todos.port';

@Injectable()
export default class AddTodoUsecase extends Usecase<
  AddTodoUsecaseRequest,
  TodoEntity
> {
  constructor(
    @Inject(TodosPortInjectorName) private readonly todosPort: TodosPort,
  ) {
    super();
  }
  async call(
    request: AddTodoUsecaseRequest,
  ): Promise<UsecaseResponse<TodoEntity>> {
    const result: TodoEntity | Error = await this.todosPort.addTodo(request);
    if (result instanceof Error) {
      return UsecaseResponse.fromError(result);
    }
    return UsecaseResponse.fromData(result);
  }
}
