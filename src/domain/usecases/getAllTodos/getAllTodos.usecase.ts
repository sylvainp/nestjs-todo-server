import { Inject, Injectable } from '@nestjs/common';
import Usecase from '../usecase';
import UsecaseResponse from '../usecase.response';
import TodoEntity from '../../entities/todo.entity';
import { TodosPort, TodosPortInjectorName } from '../../ports/todos.port';

@Injectable()
export class GetAllTodosUsecase extends Usecase<null, TodoEntity[]> {
  constructor(
    @Inject(TodosPortInjectorName) private readonly todosPort: TodosPort,
  ) {
    super();
  }

  async call(): Promise<UsecaseResponse<TodoEntity[]>> {
    const response: TodoEntity[] | Error = await this.todosPort.getAllTodos();
    if (response instanceof Error) {
      return UsecaseResponse.fromError(response);
    }
    return UsecaseResponse.fromData(response);
  }
}
