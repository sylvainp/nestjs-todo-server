import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './adapters/primaries/routes/todos/todos.module';
import TypeOrmConfig from './adapters/secondaries/database/typeorm.config';

@Module({
  imports: [TodosModule, TypeOrmModule.forRoot(TypeOrmConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {}
