import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './adapters/primaries/routes/todos/todos.module';
import TypeOrmConfig from './adapters/secondaries/database/typeorm.config';
import { AuthenticationModule } from './adapters/primaries/routes/auth/authentication/authentication.module';

@Module({
  imports: [
    TodosModule,
    AuthenticationModule,
    TypeOrmModule.forRoot(TypeOrmConfig),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
