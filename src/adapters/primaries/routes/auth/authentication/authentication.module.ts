import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthPortInjectorName } from '../../../../../domain/ports/auth.port';
import { UsersPortInjectorName } from '../../../../../domain/ports/users.port';
import LoginUsecase from '../../../../../domain/usecases/login/login.usecase';
import { RegisterUsecase } from '../../../../../domain/usecases/register/register.usecase';
import AuthenticationAdapter from '../../../../secondaries/authentication/authentication.adapter';
import { UserDBEntity } from '../../../../secondaries/database/entities/user.typeorm.entity';
import { UserRepositoryAdapter } from '../../../../secondaries/database/repositories/user/user.repository.adapter';
import { JwtStrategy } from '../../../passport/jwt.strategy';
import { LocalStrategy } from '../../../passport/local.strategy';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserDBEntity]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  providers: [
    JwtStrategy,
    LocalStrategy,
    LoginUsecase,
    RegisterUsecase,
    { provide: AuthPortInjectorName, useClass: AuthenticationAdapter },
    { provide: UsersPortInjectorName, useClass: UserRepositoryAdapter },
  ],
  controllers: [AuthenticationController],
  exports: [],
})
export class AuthenticationModule {}
