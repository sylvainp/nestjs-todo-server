import { Inject, Injectable } from '@nestjs/common';
import { TodosPort, TodosPortInjectorName } from '../../ports/todos.port';
import Usecase from '../usecase';
import UsecaseResponse from '../usecase.response';
import RemoveTodoUsecaseRequest from './removeTodo.usecaserequest';

@Injectable()
export default class RemoveTodoUsecase extends Usecase<
  RemoveTodoUsecaseRequest,
  void
> {
  constructor(
    @Inject(TodosPortInjectorName) private readonly todosPort: TodosPort,
  ) {
    super();
  }
  async call(
    request: RemoveTodoUsecaseRequest,
  ): Promise<UsecaseResponse<void>> {
    const response: void | Error = await this.todosPort.removeTodo(request);
    if (response instanceof Error) {
      return UsecaseResponse.fromError(response);
    }
    return UsecaseResponse.fromData(undefined);
  }
}
