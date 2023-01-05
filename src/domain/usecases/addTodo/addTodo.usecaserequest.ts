import UsecaseRequest from '../usecase.request';

export default interface AddTodoUsecaseRequest extends UsecaseRequest {
  title: string;
}
