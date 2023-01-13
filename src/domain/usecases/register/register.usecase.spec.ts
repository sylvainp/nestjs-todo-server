import { Test } from '@nestjs/testing';
import { AuthMockAdapter } from '../../ports/auth.mock.port';
import { AuthPort, AuthPortInjectorName } from '../../ports/auth.port';
import UsecaseResponse from '../usecase.response';
import { RegisterUsecase } from './register.usecase';
import { RegisterUsecaseRequest } from './register.usercaserequest';

describe('RegisterUsecase', () => {
  let authPort: AuthPort;
  let usecase: RegisterUsecase;
  const mockRequest: RegisterUsecaseRequest = {
    email: 'email',
    familyName: 'family',
    givenName: 'given',
    password: 'pass',
  };
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: AuthPortInjectorName, useClass: AuthMockAdapter },
        RegisterUsecase,
      ],
    }).compile();

    authPort = module.get<AuthPort>(AuthPortInjectorName);
    usecase = module.get<RegisterUsecase>(RegisterUsecase);
  });
  it('DI must resolve all components', () => {
    expect.assertions(2);
    expect(authPort).toBeDefined();
    expect(usecase).toBeDefined();
  });

  it('call function must call authPort register function with params', async () => {
    expect.assertions(2);

    jest.spyOn(authPort, 'register').mockResolvedValue('fakeresponse');
    await usecase.call(mockRequest);
    expect(authPort.register).toHaveBeenCalledTimes(1);
    expect(authPort.register).toHaveBeenCalledWith(mockRequest);
  });

  it('call function must return a usecaseresponse with data if register succeed', async () => {
    expect.assertions(2);
    const expectedResponse = 'fake_reponse';
    jest.spyOn(authPort, 'register').mockResolvedValue(expectedResponse);
    const response: UsecaseResponse<string> = await usecase.call(mockRequest);
    expect(response.error).toBeNull();
    expect(response.data).toStrictEqual(expectedResponse);
  });

  it('call function must return a usecaseresponse with error if register return an error', async () => {
    expect.assertions(2);
    const expectedError = new Error('User already exists');
    jest.spyOn(authPort, 'register').mockResolvedValue(expectedError);
    const response: UsecaseResponse<string> = await usecase.call(mockRequest);
    expect(response.data).toBeNull();
    expect(response.error).toStrictEqual(expectedError);
  });
});
