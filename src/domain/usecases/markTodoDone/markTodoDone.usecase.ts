import { Inject, Injectable } from '@nestjs/common';
import TodoEntity from '../../entities/todo.entity';
import { TodosPort, TodosPortInjectorName } from '../../ports/todos.port';
import Usecase from '../usecase';
import UsecaseResponse from '../usecase.response';
import { MarkTodoDoneUsecaseRequest } from './marlTodoDone.usecaserequest';

@Injectable()
export class MarkTodoDoneUsecase extends Usecase<
  MarkTodoDoneUsecaseRequest,
  TodoEntity
> {
  constructor(
    @Inject(TodosPortInjectorName) private readonly todosPort: TodosPort,
  ) {
    super();
  }
  async call(
    request: MarkTodoDoneUsecaseRequest,
  ): Promise<UsecaseResponse<TodoEntity>> {
    const response: TodoEntity | Error = await this.todosPort.markTodoDone(
      request,
    );
    if (response instanceof Error) {
      return UsecaseResponse.fromError(response);
    }
    return UsecaseResponse.fromData(response);
  }
}
