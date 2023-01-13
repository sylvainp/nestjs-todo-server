import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import UserEntity from '../../../domain/entities/user.entity';
import { AuthPort } from '../../../domain/ports/auth.port';
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
    private jwtService: JwtService,
  ) {}
  async validateUser(request: {
    username: string;
    password: string;
  }): Promise<UserEntity | Error> {
    console.debug('AuthenticationAdapter.validateUser', { request });
    try {
      const response: UserEntity | Error = await this.userAdaper.getUser({
        email: request.username,
      });
      if (
        response instanceof UserEntity &&
        response.password === request.password
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
    console.debug(
      'AuthenticationAdapter.login',
      `request=${JSON.stringify(request)}`,
    );

    const jwt = this.jwtService.sign({
      username: request.user.email,
      sub: request.user.id,
    });
    return { access_token: jwt };
  }
  async register(request: RegisterUsecaseRequest): Promise<string | Error> {
    const response: UserEntity | Error = await this.userAdaper.createUser(
      request,
    );
    if (response instanceof Error) {
      return response;
    }
    return response.id;
  }
  logout(): Promise<void | Error> {
    throw new Error('Method not implemented.');
  }
}
