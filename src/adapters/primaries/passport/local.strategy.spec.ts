import { UnauthorizedException } from '@nestjs/common';
import UserEntity from '../../../domain/entities/user.entity';
import { AuthMockAdapter } from '../../../domain/ports/auth.mock.port';
import { AuthPort } from '../../../domain/ports/auth.port';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let mockAuthAdapter: AuthPort;
  let localStrategy: LocalStrategy;
  const mockUserName = 'userName';
  const mockPassword = 'password';

  beforeAll(() => {
    mockAuthAdapter = new AuthMockAdapter();
    localStrategy = new LocalStrategy(mockAuthAdapter);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('validate function must call authPort function', async () => {
    expect.assertions(2);
    jest.spyOn(mockAuthAdapter, 'validateUser');
    await localStrategy.validate(mockUserName, mockPassword);
    expect(mockAuthAdapter.validateUser).toHaveBeenCalledTimes(1);
    expect(mockAuthAdapter.validateUser).toHaveBeenLastCalledWith({
      username: mockUserName,
      password: mockPassword,
    });
  });

  it('validate function must throw an exception if authPort no return user', async () => {
    expect.assertions(1);
    jest
      .spyOn(mockAuthAdapter, 'validateUser')
      .mockResolvedValueOnce(new Error('No user found'));
    await expect(
      localStrategy.validate(mockUserName, mockPassword),
    ).rejects.toStrictEqual(new UnauthorizedException());
  });

  it('validate function must return userEntity returned by authPort', async () => {
    expect.assertions(1);
    const expectedUser = new UserEntity(
      '1',
      'givenname.familyname@gmail.com',
      'familyName',
      'givenName',
      'password',
    );
    jest.spyOn(mockAuthAdapter, 'validateUser').mockResolvedValue(expectedUser);
    const result = await localStrategy.validate(mockUserName, mockPassword);
    expect(result).toStrictEqual(expectedUser);
  });
});
