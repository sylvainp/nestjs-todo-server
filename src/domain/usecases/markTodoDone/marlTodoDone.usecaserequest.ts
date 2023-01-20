import UsecaseRequest from '../usecase.request';

export interface MarkTodoDoneUsecaseRequest extends UsecaseRequest {
  todoId: string;
  done: boolean;
}
