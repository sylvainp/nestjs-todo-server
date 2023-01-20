import { HttpException, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { use } from 'passport';
import TodoEntity from '../../../../domain/entities/todo.entity';
import { TodosPortInjectorName } from '../../../../domain/ports/todos.port';
import AddTodoUsecase from '../../../../domain/usecases/addTodo/addTodo.usecase';
import { GetAllTodosUsecase } from '../../../../domain/usecases/getAllTodos/getAllTodos.usecase';
import { MarkTodoDoneUsecase } from '../../../../domain/usecases/markTodoDone/markTodoDone.usecase';
import { MarkTodoDoneUsecaseRequest } from '../../../../domain/usecases/markTodoDone/marlTodoDone.usecaserequest';
import RemoveTodoUsecase from '../../../../domain/usecases/removeTodo/removeTodo.usecase';
import UsecaseResponse from '../../../../domain/usecases/usecase.response';
import InMemoryAdapter from '../../../secondaries/InMemory/inMemory.adapter';
import { ControllerResponse } from '../controller.response';
import TodosController from './todos.controller';

describe('TodosController', () => {
  let moduleRef;
  let todosController: TodosController;
  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        { provide: TodosPortInjectorName, useClass: InMemoryAdapter },
        GetAllTodosUsecase,
        AddTodoUsecase,
        RemoveTodoUsecase,
        MarkTodoDoneUsecase,
      ],
      controllers: [TodosController],
    }).compile();
    todosController = moduleRef.get(TodosController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('DI must resolve todosContoller', () => {
    expect.assertions(1);
    expect(todosController).toBeDefined();
  });

  describe('markdone', () => {
    let markTodoDoneUsecase: MarkTodoDoneUsecase;
    const mockRequest: MarkTodoDoneUsecaseRequest = { todoId: '1', done: true };
    beforeAll(() => {
      markTodoDoneUsecase = moduleRef.get(MarkTodoDoneUsecase);
    });
    it('DI must resolve usecase', async () => {
      expect.assertions(1);
      expect(markTodoDoneUsecase).toBeDefined();
    });

    it('function must call markTodoDone usecase', async () => {
      expect.assertions(2);
      jest
        .spyOn(markTodoDoneUsecase, 'call')
        .mockResolvedValue(
          UsecaseResponse.fromData(
            new TodoEntity(mockRequest.todoId, 'fake_title'),
          ),
        );
      await todosController.markTodoDone(mockRequest);
      expect(markTodoDoneUsecase.call).toHaveBeenCalledTimes(1);
      expect(markTodoDoneUsecase.call).toHaveBeenCalledWith(mockRequest);
    });

    it('function must return the updated TodoEntity if usecase succeed', async () => {
      expect.assertions(1);
      const mockUpdatedTodoEntity = new TodoEntity(
        mockRequest.todoId,
        'todo 1',
      );
      const expecteResponse: UsecaseResponse<TodoEntity> =
        UsecaseResponse.fromData(mockUpdatedTodoEntity);
      jest
        .spyOn(markTodoDoneUsecase, 'call')
        .mockResolvedValue(expecteResponse);
      const response: ControllerResponse = await todosController.markTodoDone(
        mockRequest,
      );
      expect(response.data).toStrictEqual(mockUpdatedTodoEntity);
    });

    it('function must return an httpException if usecase failed', async () => {
      expect.assertions(1);
      const expectedError = new Error(
        `No todo found with id ${mockRequest.todoId}`,
      );
      jest
        .spyOn(markTodoDoneUsecase, 'call')
        .mockResolvedValue(UsecaseResponse.fromError(expectedError));
      await expect(
        todosController.markTodoDone(mockRequest),
      ).rejects.toStrictEqual(
        new HttpException(expectedError.message, HttpStatus.NOT_FOUND),
      );
    });

    it('function must throw an error if empty body provided', async () => {
      expect.assertions(2);
      jest.spyOn(markTodoDoneUsecase, 'call').mockImplementation();
      await expect(
        todosController.markTodoDone({} as MarkTodoDoneUsecaseRequest),
      ).rejects.toStrictEqual(
        new HttpException('Missing params', HttpStatus.BAD_REQUEST),
      );
      expect(markTodoDoneUsecase.call).not.toHaveBeenCalled();
    });
  });

  describe('removeTodo', () => {
    let removeTodoUsecase: RemoveTodoUsecase;
    beforeAll(() => {
      removeTodoUsecase = moduleRef.get(RemoveTodoUsecase);
    });
    it('must call removeTodoUsecase with specified todoId', async () => {
      expect.assertions(2);
      jest
        .spyOn(removeTodoUsecase, 'call')
        .mockResolvedValue(UsecaseResponse.fromData(undefined));
      const mockTodoId = '2';
      await todosController.removeTodo(mockTodoId);
      expect(removeTodoUsecase.call).toHaveBeenCalledTimes(1);
      expect(removeTodoUsecase.call).toHaveBeenCalledWith({
        todoId: mockTodoId,
      });
    });

    it('must return an HttpException if usecase return a response with error', async () => {
      expect.assertions(1);
      const mockTodoId = '2';
      const expectedError = new Error(`no todo with id ${mockTodoId} found`);
      jest
        .spyOn(removeTodoUsecase, 'call')
        .mockResolvedValue(UsecaseResponse.fromError(expectedError));
      await expect(
        todosController.removeTodo(mockTodoId),
      ).rejects.toStrictEqual(
        new HttpException(expectedError.message, HttpStatus.NOT_FOUND),
      );
    });
  });
});
