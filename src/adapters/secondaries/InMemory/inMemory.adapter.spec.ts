import { exec } from 'child_process';
import TodoEntity from '../../../domain/entities/todo.entity';
import RemoveTodoUsecaseRequest from '../../../domain/usecases/removeTodo/removeTodo.usecaserequest';
import InMemoryAdapter from './inMemory.adapter';

describe('InMemoryAdapter ', () => {
  let adapter: InMemoryAdapter;
  beforeAll(() => {
    adapter = new InMemoryAdapter();
  });

  describe('removeTodo function', () => {
    it('must remove existing todo from data', async () => {
      expect.assertions(3);
      let allTodos: TodoEntity[] | Error = await adapter.getAllTodos();
      const todoCountBeforeAdd = (allTodos as TodoEntity[]).length;
      expect(todoCountBeforeAdd).toStrictEqual(0);
      const addedEntity: TodoEntity | Error = await adapter.addTodo({
        title: 'todo 1',
      });
      allTodos = await adapter.getAllTodos();
      const todoCountAfterAdd = (allTodos as TodoEntity[]).length;
      expect(todoCountAfterAdd).toStrictEqual(1);
      await adapter.removeTodo({ todoId: (addedEntity as TodoEntity).id });
      allTodos = await adapter.getAllTodos();
      const todoCountAfterRemove = (allTodos as TodoEntity[]).length;
      expect(todoCountAfterRemove).toStrictEqual(0);
    });

    it('must return an Error if no todo found with specified id', async () => {
      expect.assertions(2);
      const expectedRemoveTodoRequest: RemoveTodoUsecaseRequest = {
        todoId: '1',
      };
      const expectedError: Error = new Error(
        `no todo with id ${expectedRemoveTodoRequest.todoId} found`,
      );
      const response: void | Error = await adapter.removeTodo(
        expectedRemoveTodoRequest,
      );
      expect(response instanceof Error).toBe(true);
      expect(response).toStrictEqual(expectedError);
    });
  });
});
