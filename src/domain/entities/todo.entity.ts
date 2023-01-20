export default class TodoEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly done: boolean = false,
  ) {}
}
