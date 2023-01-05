import InMemoryAdapter from '../../../adapters/secondaries/InMemory/inMemory.adapter';
import TodoEntity from '../../entities/todo.entity';
import AddTodoUsecase from './addTodo.usecase';

describe('AddTodoUsecase', () => {
  let inMemoryAdapter: InMemoryAdapter;
  let usecase: AddTodoUsecase;
  beforeAll(() => {
    inMemoryAdapter = new InMemoryAdapter();
    usecase = new AddTodoUsecase(inMemoryAdapter);
  });

  test('call function must call adapter function', async () => {
    expect.assertions(1);
    jest
      .spyOn(inMemoryAdapter, 'addTodo')
      .mockResolvedValue(new TodoEntity('1', 'Todo 1'));
    await usecase.call({ title: 'Todo 1' });
    expect(inMemoryAdapter.addTodo).toHaveBeenCalledTimes(1);
  });
});
