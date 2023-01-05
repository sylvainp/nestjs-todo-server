import UsecaseRequest from '../usecase.request';

export default interface RemoveTodoUsecaseRequest extends UsecaseRequest {
  todoId: string;
}
