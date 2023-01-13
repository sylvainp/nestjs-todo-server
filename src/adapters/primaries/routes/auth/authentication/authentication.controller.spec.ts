import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import UserEntity from '../../../../../domain/entities/user.entity';
import { AuthPortInjectorName } from '../../../../../domain/ports/auth.port';
import LoginUsecase from '../../../../../domain/usecases/login/login.usecase';
import { LocalStrategy } from '../../../passport/local.strategy';
import { AuthenticationController } from './authentication.controller';
import * as request from 'supertest';

xdescribe('AuthenticationController', () => {
  let app: INestApplication;

  let controller: AuthenticationController;
  let localStrategy: LocalStrategy;
  const authPort = {
    login: () => ({ access_token: 'my_access_token' }),
    validateUser: () =>
      Promise.resolve(
        new UserEntity(
          '1',
          'givenname.familyname@gmail.com',
          'familyName',
          'givenName',
          'password',
        ),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        LoginUsecase,
        { provide: AuthPortInjectorName, useValue: authPort },
      ],
      controllers: [AuthenticationController],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    controller = module.get<AuthenticationController>(AuthenticationController);
    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('DI must inject each component', () => {
    expect.assertions(2);
    expect(controller).toBeDefined();
    expect(localStrategy).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('login function', () => {
    it('must call local.strategy validate function ', async () => {
      return request(app.getHttpServer()).post('auth/login');
    });
  });
});
