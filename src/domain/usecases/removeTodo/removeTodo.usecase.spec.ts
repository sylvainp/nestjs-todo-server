import { Test } from '@nestjs/testing';
import InMemoryAdapter from '../../../adapters/secondaries/InMemory/inMemory.adapter';
import { TodosPortInjectorName } from '../../ports/todos.port';
import UsecaseResponse from '../usecase.response';
import RemoveTodoUsecase from './removeTodo.usecase';
import RemoveTodoUsecaseRequest from './removeTodo.usecaserequest';

fdescribe('RemoveTodoUsecase', () => {
  let adapter: InMemoryAdapter;
  let removeTodoUsecase: RemoveTodoUsecase;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RemoveTodoUsecase,
        { provide: TodosPortInjectorName, useClass: InMemoryAdapter },
      ],
    }).compile();
    adapter = moduleRef.get(TodosPortInjectorName);
    removeTodoUsecase = moduleRef.get(RemoveTodoUsecase);
  });

  it('call function must call adapter with request', async () => {
    expect.assertions(2);
    const expectedRemoveTodoRequest: RemoveTodoUsecaseRequest = { todoId: '1' };
    jest.spyOn(adapter, 'removeTodo').mockResolvedValue(undefined);
    await removeTodoUsecase.call(expectedRemoveTodoRequest);
    expect(adapter.removeTodo).toHaveBeenCalledTimes(1);
    expect(adapter.removeTodo).toHaveBeenCalledWith(expectedRemoveTodoRequest);
  });

  it('call function must return a usecaseResponse with undefined data if adapter removeTodo function succeed', async () => {
    expect.assertions(2);
    const expectedRemoveTodoRequest: RemoveTodoUsecaseRequest = { todoId: '1' };
    jest.spyOn(adapter, 'removeTodo').mockResolvedValue(undefined);
    const response: UsecaseResponse<void> = await removeTodoUsecase.call(
      expectedRemoveTodoRequest,
    );
    expect(response.data).toBeUndefined();
    expect(response.error).toBeNull();
  });

  it('call function must return a usecaseResponse with error if adapter removeTodo function failed', async () => {
    expect.assertions(2);
    const expectedRemoveTodoRequest: RemoveTodoUsecaseRequest = { todoId: '1' };
    const expectedError: Error = new Error(
      `unable to remove todo with id ${expectedRemoveTodoRequest.todoId}`,
    );
    jest.spyOn(adapter, 'removeTodo').mockResolvedValue(expectedError);
    const response: UsecaseResponse<void> = await removeTodoUsecase.call(
      expectedRemoveTodoRequest,
    );
    expect(response.data).toBeNull();
    expect(response.error).toStrictEqual(expectedError);
  });
});
