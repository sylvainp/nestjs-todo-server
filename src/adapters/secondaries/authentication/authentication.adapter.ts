import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import UserEntity from '../../../domain/entities/user.entity';
import { AuthPort } from '../../../domain/ports/auth.port';
import {
  EncryptionPort,
  EncryptionPortInjectorName,
} from '../../../domain/ports/encrypt.port';
import {
  UsersPort,
  UsersPortInjectorName,
} from '../../../domain/ports/users.port';
import LoginUsecaseRequest from '../../../domain/usecases/login/login.usecaserequest';
import { RegisterUsecaseRequest } from '../../../domain/usecases/register/register.usercaserequest';

@Injectable()
export default class AuthenticationAdapter implements AuthPort {
  constructor(
    @Inject(UsersPortInjectorName) private readonly userAdaper: UsersPort,
    @Inject(EncryptionPortInjectorName)
    private readonly encryptAdapter: EncryptionPort,
    private jwtService: JwtService,
  ) {}
  async validateUser(request: {
    username: string;
    password: string;
  }): Promise<UserEntity | Error> {
    try {
      const response: UserEntity | Error = await this.userAdaper.getUser({
        email: request.username,
      });

      if (
        response instanceof UserEntity &&
        (await this.encryptAdapter.compare(request.password, response.password))
      ) {
        return response;
      }
      return new Error('No user found');
    } catch (error) {
      return new Error('No user found');
    }
  }
  async login(
    request: LoginUsecaseRequest,
  ): Promise<{ access_token: string } | Error> {
    const jwt = this.jwtService.sign({
      username: request.user.email,
      sub: request.user.id,
    });
    return { access_token: jwt };
  }
  async register(request: RegisterUsecaseRequest): Promise<string | Error> {
    const hashPassword = await this.encryptAdapter.hash(request.password);
    const response: UserEntity | Error = await this.userAdaper.createUser({
      email: request.email,
      familyName: request.familyName,
      givenName: request.givenName,
      password: hashPassword,
    });
    if (response instanceof Error) {
      return response;
    }
    return response.id;
  }
  logout(): Promise<void | Error> {
    throw new Error('Method not implemented.');
  }
}
