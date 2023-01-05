import UsecaseRequest from './usecase.request';
import UsecaseResponse from './usecase.response';

export default abstract class Usecase<R extends UsecaseRequest | null, T> {
  abstract call(request: R): Promise<UsecaseResponse<T>>;
}
