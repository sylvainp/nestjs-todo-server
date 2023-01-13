export default class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly familyName: string,
    public readonly givenName: string,
    public readonly password: string,
  ) {}
}
