export default class UsecaseResponse<T> {
  private constructor(private _data: T | null, private _error: Error | null) {}

  public static fromData<T>(data: T): UsecaseResponse<T> {
    return new UsecaseResponse(data, null);
  }

  public static fromError<T>(error: Error): UsecaseResponse<T> {
    return new UsecaseResponse<T>(null, error);
  }

  get data(): T | null {
    return this._data;
  }

  get error(): Error | null {
    return this._error;
  }
}
