import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TodoEntity from '../../../../domain/entities/todo.entity';
import TodoDBEntity from '../entities/todo.typeorm.entity';
import TodoRepositoryAdapter from './todo.repository.adapter';
import TodoRepositoryMock from './todo.repository.mock';

describe('TodoRepositoryAdapter', () => {
  let todoRepository: Repository<TodoDBEntity>;
  let todoRepositoryAdapter: TodoRepositoryAdapter;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(TodoDBEntity),
          useClass: TodoRepositoryMock,
        },
        TodoRepositoryAdapter,
      ],
    }).compile();
    todoRepository = moduleRef.get(getRepositoryToken(TodoDBEntity));
    todoRepositoryAdapter = moduleRef.get(TodoRepositoryAdapter);
  });
  it('DI must resolve todoRepositoryAdapter', () => {
    expect.assertions(1);
    expect(todoRepositoryAdapter).toBeDefined();
  });

  const createMockTodoDBEntity = (id = '1', title = 'todo 1'): TodoDBEntity => {
    const todoDBEntity = new TodoDBEntity();
    todoDBEntity.id = id;
    todoDBEntity.title = title;
    return todoDBEntity;
  };

  describe('addTodo function', () => {
    it('must call repository for adding new record', async () => {
      expect.assertions(3);
      const expectedTodoTitle = 'todo 1';
      const expectedCreatedTodoDBEntity = createMockTodoDBEntity(
        '1',
        expectedTodoTitle,
      );
      jest
        .spyOn(todoRepository, 'create')
        .mockReturnValue(expectedCreatedTodoDBEntity);
      jest
        .spyOn(todoRepository, 'save')
        .mockResolvedValue(expectedCreatedTodoDBEntity);
      await todoRepositoryAdapter.addTodo({ title: 'todo 1' });
      expect(todoRepository.create).toHaveBeenCalledTimes(1);
      expect(todoRepository.create).toHaveBeenCalledWith({
        title: expectedTodoTitle,
      });
      expect(todoRepository.save).toHaveBeenCalledWith(
        expectedCreatedTodoDBEntity,
      );
    });

    it('must return a TodoEntity build from TodoDBEntity', async () => {
      expect.assertions(3);
      const expectedTodoTitle = 'todo 1';
      const expectedCreatedTodoDBEntity = createMockTodoDBEntity(
        '1',
        expectedTodoTitle,
      );

      jest
        .spyOn(todoRepository, 'create')
        .mockReturnValue(expectedCreatedTodoDBEntity);
      jest
        .spyOn(todoRepository, 'save')
        .mockResolvedValue(expectedCreatedTodoDBEntity);
      const response: TodoEntity | Error = await todoRepositoryAdapter.addTodo({
        title: 'todo 1',
      });
      expect(response instanceof TodoEntity).toBe(true);
      expect((response as TodoEntity).title).toStrictEqual(
        expectedCreatedTodoDBEntity.title,
      );
      expect((response as TodoEntity).id).toStrictEqual(
        expectedCreatedTodoDBEntity.id,
      );
    });

    it('must return an Error if save repository throw an error', async () => {
      expect.assertions(2);
      const mockTodoDBEntity = createMockTodoDBEntity();
      const expectedError = new Error('Unable to save data');
      jest.spyOn(todoRepository, 'create').mockReturnValue(mockTodoDBEntity);
      jest.spyOn(todoRepository, 'save').mockRejectedValue(expectedError);
      const response: TodoEntity | Error = await todoRepositoryAdapter.addTodo({
        title: 'todo',
      });
      expect(response instanceof Error).toBe(true);
      expect(response).toStrictEqual(expectedError);
    });
  });

  describe('removeTodo function', () => {
    it('must call todoRepository for removing existing todo record', async () => {
      expect.assertions(2);
      const mockRemovedEntity = createMockTodoDBEntity();
      jest
        .spyOn(todoRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: {} });
      await todoRepositoryAdapter.removeTodo({ todoId: mockRemovedEntity.id });
      expect(todoRepository.delete).toHaveBeenCalledTimes(1);
      expect(todoRepository.delete).toHaveBeenCalledWith(mockRemovedEntity.id);
    });
    it('must return the repository error if exist', async () => {
      expect.assertions(2);
      const expectedError = new Error('unable to delete data');
      jest.spyOn(todoRepository, 'delete').mockRejectedValue(expectedError);
      const response: void | Error = await todoRepositoryAdapter.removeTodo({
        todoId: '1',
      });
      expect(response instanceof Error).toBe(true);
      expect(response).toStrictEqual(expectedError);
    });
  });

  describe('getAllTodos function', () => {
    it('must call repository for returning all todos', async () => {
      expect.assertions(1);

      jest.spyOn(todoRepository, 'find').mockResolvedValue([]);
      await todoRepositoryAdapter.getAllTodos();
      expect(todoRepository.find).toHaveBeenCalledTimes(1);
    });

    it('must return todoEntity array build from repository response', async () => {
      expect.assertions(2);
      const expectedRepositoryResult = [
        createMockTodoDBEntity('1', 'todo 1'),
        createMockTodoDBEntity('2', 'todo 2'),
        createMockTodoDBEntity('3', 'todo 3'),
      ];
      const expectedResult = [
        new TodoEntity('1', 'todo 1'),
        new TodoEntity('2', 'todo 2'),
        new TodoEntity('3', 'todo 3'),
      ];
      jest
        .spyOn(todoRepository, 'find')
        .mockResolvedValue(expectedRepositoryResult);
      const response: TodoEntity[] | Error =
        await todoRepositoryAdapter.getAllTodos();
      expect(response instanceof Array<TodoEntity>).toBe(true);
      expect(response).toStrictEqual(expectedResult);
    });
    it('must return the error provided by repository', async () => {
      expect.assertions(2);
      const expectedError = new Error('database closed');
      jest.spyOn(todoRepository, 'find').mockRejectedValue(expectedError);
      const response: TodoEntity[] | Error =
        await todoRepositoryAdapter.getAllTodos();
      expect(response instanceof Error).toBe(true);
      expect(response).toStrictEqual(expectedError);
    });
  });
});
