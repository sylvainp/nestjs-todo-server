import TodoEntity from '../entities/todo.entity';
import AddTodoUsecaseRequest from '../usecases/addTodo/addTodo.usecaserequest';
import RemoveTodoUsecaseRequest from '../usecases/removeTodo/removeTodo.usecaserequest';

export const TodosPortInjectorName = 'TodosPortInjectorName';
export interface TodosPort {
  addTodo(request: AddTodoUsecaseRequest): Promise<TodoEntity | Error>;
  removeTodo(request: RemoveTodoUsecaseRequest): Promise<void | Error>;
  getAllTodos(): Promise<TodoEntity[] | Error>;
}
