import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import TodoDBEntity from '../entities/todo.typeorm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoDBEntity])],
  providers: [],
})
export class TodoRepositoryModule {}
