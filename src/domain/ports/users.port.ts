import UserEntity from '../entities/user.entity';
import { RegisterUsecaseRequest } from '../usecases/register/register.usercaserequest';

export const UsersPortInjectorName = 'UsersPortInjectorName';
export interface UsersPort {
  createUser(request: RegisterUsecaseRequest): Promise<UserEntity | Error>;
  getUser(request: { email: string }): Promise<UserEntity | Error>;
  removeUser(): Promise<void | Error>;
  updateUser(request: any): Promise<UserEntity | Error>;
}
