import UsecaseRequest from '../usecase.request';

export interface RegisterUsecaseRequest extends UsecaseRequest {
  email: string;
  familyName: string;
  givenName: string;
  password: string;
}
