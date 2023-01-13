import UserEntity from '../entities/user.entity';
import { AuthPort } from './auth.port';

export class AuthMockAdapter implements AuthPort {
  async validateUser(request: {
    username: string;
    password: string;
  }): Promise<UserEntity | null> {
    return Promise.resolve(
      new UserEntity(
        '1',
        'givenname.familyname@gmail.com',
        'familyName',
        'givenName',
        'password',
      ),
    );
  }

  login(request: any): Promise<any> {
    return Promise.resolve();
  }
  register(request: any): Promise<any> {
    return Promise.resolve();
  }
  logout(): Promise<void | Error> {
    return Promise.resolve();
  }
}
