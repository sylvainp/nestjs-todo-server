import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import UserEntity from '../../../domain/entities/user.entity';
import {
  AuthPort,
  AuthPortInjectorName,
} from '../../../domain/ports/auth.port';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthPortInjectorName) private readonly authPort: AuthPort,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user: UserEntity | Error = await this.authPort.validateUser({
      username,
      password,
    });
    if (user instanceof Error) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
