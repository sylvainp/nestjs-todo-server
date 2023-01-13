import { Repository } from 'typeorm';
import UserEntity from '../../../../../domain/entities/user.entity';

export class UserRepositoryMock extends Repository<UserEntity> {}
