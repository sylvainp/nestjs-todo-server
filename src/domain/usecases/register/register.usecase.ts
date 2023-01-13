import { Inject, Injectable } from '@nestjs/common';
import { AuthPort, AuthPortInjectorName } from '../../ports/auth.port';
import Usecase from '../usecase';
import UsecaseResponse from '../usecase.response';
import { RegisterUsecaseRequest } from './register.usercaserequest';

@Injectable()
export class RegisterUsecase extends Usecase<RegisterUsecaseRequest, string> {
  constructor(
    @Inject(AuthPortInjectorName) private readonly authPort: AuthPort,
  ) {
    super();
  }
  async call(
    request: RegisterUsecaseRequest,
  ): Promise<UsecaseResponse<string>> {
    const response: string | Error = await this.authPort.register(request);
    if (response instanceof Error) {
      return UsecaseResponse.fromError(response);
    }
    return UsecaseResponse.fromData(response);
  }
}
