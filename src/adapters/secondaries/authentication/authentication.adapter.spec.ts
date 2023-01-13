import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import UserEntity from '../../../domain/entities/user.entity';
import { UsersMockAdapter } from '../../../domain/ports/users.mock.port';
import {
  UsersPort,
  UsersPortInjectorName,
} from '../../../domain/ports/users.port';
import { RegisterUsecaseRequest } from '../../../domain/usecases/register/register.usercaserequest';
import AuthenticationAdapter from './authentication.adapter';

describe('AuthenticationAdapter', () => {
  let usersPort: UsersPort;
  let adapter: AuthenticationAdapter;
  let jwtService: JwtService;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'my_fake_secret' })],
      providers: [
        { provide: UsersPortInjectorName, useClass: UsersMockAdapter },
        AuthenticationAdapter,
      ],
    }).compile();
    jwtService = module.get<JwtService>(JwtService);
    usersPort = module.get<UsersPort>(UsersPortInjectorName);
    adapter = module.get<AuthenticationAdapter>(AuthenticationAdapter);
  });

  it('DI must resolve all components', async () => {
    expect.assertions(3);
    expect(usersPort).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(adapter).toBeDefined();
  });

  describe('register function', () => {
    const mockRequest: RegisterUsecaseRequest = {
      email: 'email',
      familyName: 'familyName',
      givenName: 'givenName',
      password: 'pass',
    };

    it('must call userPort createUser function', async () => {
      expect.assertions(2);
      jest
        .spyOn(usersPort, 'createUser')
        .mockResolvedValue(
          new UserEntity('2', 'email', 'familyName', 'givenName', 'password'),
        );
      await adapter.register(mockRequest);
      expect(usersPort.createUser).toHaveBeenCalledTimes(1);
      expect(usersPort.createUser).toHaveBeenCalledWith(mockRequest);
    });

    it('must return userId if userPort createUser succeed', async () => {
      expect.assertions(1);
      const mockUser = new UserEntity(
        '2',
        'email',
        'familyName',
        'givenName',
        'password',
      );
      jest.spyOn(usersPort, 'createUser').mockResolvedValue(mockUser);
      const response: string | Error = await adapter.register(mockRequest);
      expect(response).toStrictEqual(mockUser.id);
    });

    it('must return Error if userPort createUser return an error', async () => {
      expect.assertions(1);
      const mockError = new Error('User already exist');
      jest.spyOn(usersPort, 'createUser').mockResolvedValue(mockError);
      const response: string | Error = await adapter.register(mockRequest);
      expect(response).toStrictEqual(mockError);
    });
  });
  describe('login function', () => {
    it('must call jwtService', async () => {
      expect.assertions(2);
      const mockUserEntity = new UserEntity(
        '1',
        'email',
        'familyName',
        'givenName',
        'password',
      );
      const mockJwt = 'my_fake_jwt';
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockJwt);
      await adapter.login({ user: mockUserEntity });
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUserEntity.email,
        sub: mockUserEntity.id,
      });
    });

    it('must return an access_token build with jwtService response', async () => {
      expect.assertions(1);
      const mockUserEntity = new UserEntity(
        '1',
        'email',
        'familyName',
        'givenName',
        'password',
      );
      const mockJwt = 'my_fake_jwt';
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockJwt);
      const response: { access_token: string } | Error = await adapter.login({
        user: mockUserEntity,
      });
      expect(response).toStrictEqual({ access_token: mockJwt });
    });
  });

  describe('validateUser function', () => {
    it('must call userPort getUser function', async () => {
      expect.assertions(2);
      jest
        .spyOn(usersPort, 'getUser')
        .mockResolvedValue(
          new UserEntity('1', 'email', 'familyName', 'givenName', 'password'),
        );
      await adapter.validateUser({
        username: 'username',
        password: 'password',
      });
      expect(usersPort.getUser).toHaveBeenCalledTimes(1);
      expect(usersPort.getUser).toHaveBeenCalledWith({ email: 'username' });
    });

    it('must return an Error if userPort return error', async () => {
      expect.assertions(1);
      const expectedError = new Error('No user found');
      jest.spyOn(usersPort, 'getUser').mockResolvedValue(expectedError);
      await expect(
        adapter.validateUser({ username: 'email', password: '123' }),
      ).resolves.toStrictEqual(new Error('No user found'));
    });

    it('must return an error if getUser userPort response password does not match with paramas password', async () => {
      expect.assertions(1);
      const expectedPassword = 'password';
      const mockUserEntity = new UserEntity(
        '1',
        'email',
        'familyName',
        'givenName',
        expectedPassword,
      );
      jest.spyOn(usersPort, 'getUser').mockResolvedValue(mockUserEntity);
      await expect(
        adapter.validateUser({
          username: 'username',
          password: 'other_password',
        }),
      ).resolves.toStrictEqual(new Error('No user found'));
    });

    it('must return userEntity returned by userPort if passwords match', async () => {
      expect.assertions(1);
      const expectedPassword = 'password';
      const mockUserEntity = new UserEntity(
        '1',
        'email',
        'familyName',
        'givenName',
        expectedPassword,
      );
      jest.spyOn(usersPort, 'getUser').mockResolvedValue(mockUserEntity);
      await expect(
        adapter.validateUser({
          username: 'username',
          password: expectedPassword,
        }),
      ).resolves.toStrictEqual(mockUserEntity);
    });
  });
});
