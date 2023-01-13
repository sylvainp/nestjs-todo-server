import UserEntity from '../entities/user.entity';
import LoginUsecaseRequest from '../usecases/login/login.usecaserequest';
import { RegisterUsecaseRequest } from '../usecases/register/register.usercaserequest';

export const AuthPortInjectorName = 'AuthPortInjectorName';
export interface AuthPort {
  validateUser(request: {
    username: string;
    password: string;
  }): Promise<UserEntity | Error>;
  login(
    request: LoginUsecaseRequest,
  ): Promise<{ access_token: string } | Error>;
  register(request: RegisterUsecaseRequest): Promise<string | Error>;
  logout(): Promise<void | Error>;
}
