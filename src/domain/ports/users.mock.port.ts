import { NotImplementedException } from '@nestjs/common';
import UserEntity from '../entities/user.entity';
import { UsersPort } from './users.port';

export class UsersMockAdapter implements UsersPort {
  createUser(request: any): Promise<UserEntity | Error> {
    throw new NotImplementedException();
  }
  getUser(request: { email: string }): Promise<UserEntity | Error> {
    throw new NotImplementedException();
  }
  removeUser(): Promise<void | Error> {
    throw new NotImplementedException();
  }
  updateUser(request: any): Promise<UserEntity | Error> {
    throw new NotImplementedException();
  }
}
