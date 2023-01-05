import { HttpException, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TodosPortInjectorName } from '../../../../domain/ports/todos.port';
import AddTodoUsecase from '../../../../domain/usecases/addTodo/addTodo.usecase';
import { GetAllTodosUsecase } from '../../../../domain/usecases/getAllTodos/getAllTodos.usecase';
import RemoveTodoUsecase from '../../../../domain/usecases/removeTodo/removeTodo.usecase';
import UsecaseResponse from '../../../../domain/usecases/usecase.response';
import InMemoryAdapter from '../../../secondaries/InMemory/inMemory.adapter';
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
      ],
      controllers: [TodosController],
    }).compile();
    todosController = moduleRef.get(TodosController);
  });

  it('DI must resolve todosContoller', () => {
    expect.assertions(1);
    expect(todosController).toBeDefined();
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
