import { Repository } from 'typeorm';
import TodoDBEntity from '../entities/todo.typeorm.entity';

export default class TodoRepositoryMock extends Repository<TodoDBEntity> {}
