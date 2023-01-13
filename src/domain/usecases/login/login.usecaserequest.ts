import UserEntity from '../../entities/user.entity';
import UsecaseRequest from '../usecase.request';

export default interface LoginUsecaseRequest extends UsecaseRequest {
  user: UserEntity;
}
