import { Inject, Injectable } from '@nestjs/common';
import { AuthPort, AuthPortInjectorName } from '../../ports/auth.port';
import Usecase from '../usecase';
import UsecaseResponse from '../usecase.response';
import LoginUsecaseRequest from './login.usecaserequest';

@Injectable()
export default class LoginUsecase extends Usecase<
  LoginUsecaseRequest,
  { access_token: string }
> {
  constructor(
    @Inject(AuthPortInjectorName) private readonly authPort: AuthPort,
  ) {
    super();
  }
  async call(
    request: LoginUsecaseRequest,
  ): Promise<UsecaseResponse<{ access_token: string }>> {
    const result: { access_token: string } | Error = await this.authPort.login(
      request,
    );
    if (result instanceof Error) {
      return UsecaseResponse.fromError(result);
    }
    return UsecaseResponse.fromData(result);
  }
}
