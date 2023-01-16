import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import LoginUsecase from '../../../../../domain/usecases/login/login.usecase';
import { RegisterUsecase } from '../../../../../domain/usecases/register/register.usecase';
import { RegisterUsecaseRequest } from '../../../../../domain/usecases/register/register.usercaserequest';
import UsecaseResponse from '../../../../../domain/usecases/usecase.response';
import { LocalAuthGuard } from '../../guard/local-auth.guard';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly loginUsecase: LoginUsecase,
    private readonly registerUsecase: RegisterUsecase,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // le user a été ajouté par passportjs, grace au guard.
    // le parametre "req" correspond à ce qui est retourné par la méthode validate du localStrategy
    // à ce stade, on sait qu'on a un user grace au AuthGard, qui retourne une UnauthorizedException si pas de user
    // la méthode loginUsecase.call va permettre de retourner un JWT à l'utilisateur.
    // ce JWT sera utilisé pour les autres requêtes, passé dans un header.
    // pour les routes "todos" qui devront être soumise à authentification, il y aura un nouveau guard "jwt"
    const response: UsecaseResponse<{ access_token: string }> =
      await this.loginUsecase.call({ user: req.user });
    if (response.error) {
      return new UnauthorizedException();
    }
    return response.data;
  }

  @Post('register')
  async register(@Body() request: RegisterUsecaseRequest) {
    const response: UsecaseResponse<string> = await this.registerUsecase.call(
      request,
    );
    if (response.error) {
      throw new HttpException(response.error.message, HttpStatus.CONFLICT);
    }
    return response.data;
  }
}
