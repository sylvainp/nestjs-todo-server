import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from '../../../../../domain/entities/user.entity';
import { UsersPort } from '../../../../../domain/ports/users.port';
import { RegisterUsecaseRequest } from '../../../../../domain/usecases/register/register.usercaserequest';
import { UserDBEntity } from '../../entities/user.typeorm.entity';

@Injectable()
export class UserRepositoryAdapter implements UsersPort {
  constructor(
    @InjectRepository(UserDBEntity) private readonly userRepository,
  ) {}

  async getUser(request: { email: string }): Promise<UserEntity | Error> {
    const result: UserDBEntity | null = await this.userRepository.findOneBy({
      email: request.email,
    });
    if (!result) {
      return new Error('No user found');
    }
    return new UserEntity(
      result.id,
      request.email,
      result.familyName,
      result.givenName,
      result.password,
    );
  }

  async createUser(
    request: RegisterUsecaseRequest,
  ): Promise<UserEntity | Error> {
    const userExist = await this.userRepository.exist({
      where: { email: request.email },
    });
    if (userExist) {
      return new Error('User already register');
    }
    const userToCreate = this.userRepository.create({
      email: request.email,
      familyName: request.familyName,
      givenName: request.givenName,
      password: request.password,
    });

    try {
      const userDbEntity: UserDBEntity = await this.userRepository.save(
        userToCreate,
      );

      return new UserEntity(
        userDbEntity.id,
        userDbEntity.email,
        userDbEntity.familyName,
        userDbEntity.givenName,
        userDbEntity.password,
      );
    } catch (error) {
      return new Error('An error occured creating user');
    }
  }
  removeUser(): Promise<void | Error> {
    throw new NotImplementedException();
  }
  updateUser(request: any): Promise<UserEntity | Error> {
    throw new NotImplementedException();
  }
}
