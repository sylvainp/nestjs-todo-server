import { use } from 'passport';
import InMemoryAdapter from '../../../adapters/secondaries/InMemory/inMemory.adapter';
import TodoEntity from '../../entities/todo.entity';
import { TodosPort } from '../../ports/todos.port';
import UsecaseResponse from '../usecase.response';
import { MarkTodoDoneUsecase } from './markTodoDone.usecase';
import { MarkTodoDoneUsecaseRequest } from './marlTodoDone.usecaserequest';

describe('MarkTodoDoneUsecase', () => {
  let todoPort: TodosPort;
  let usecase: MarkTodoDoneUsecase;
  const mockRequest: MarkTodoDoneUsecaseRequest = { todoId: '1', done: true };
  beforeAll(() => {
    todoPort = new InMemoryAdapter();
    usecase = new MarkTodoDoneUsecase(todoPort);
  });

  it('call function must call todoPort with params', async () => {
    expect.assertions(2);
    jest
      .spyOn(todoPort, 'markTodoDone')
      .mockResolvedValue(new TodoEntity('1', 'todo 1'));
    await usecase.call(mockRequest);
    expect(todoPort.markTodoDone).toHaveBeenCalledTimes(1);
    expect(todoPort.markTodoDone).toHaveBeenCalledWith(mockRequest);
  });

  it('call function must return usecaseResponse build with todoport response', async () => {
    expect.assertions(2);
    jest
      .spyOn(todoPort, 'markTodoDone')
      .mockResolvedValue(new TodoEntity('1', 'todo 1'));
    const response: UsecaseResponse<TodoEntity> = await usecase.call(
      mockRequest,
    );
    expect(response.error).toBeNull();
    expect(response.data).toStrictEqual(new TodoEntity('1', 'todo 1'));
  });

  it('call function must return usecasereponse with error if todoport failed', async () => {
    expect.assertions(2);
    const expectedError = new Error(
      `Unable to find todo with id ${mockRequest.todoId}`,
    );
    jest.spyOn(todoPort, 'markTodoDone').mockResolvedValue(expectedError);
    const response: UsecaseResponse<TodoEntity> = await usecase.call(
      mockRequest,
    );
    expect(response.data).toBeNull();
    expect(response.error).toStrictEqual(expectedError);
  });
});
