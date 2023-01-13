import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserEntity from '../../../../../domain/entities/user.entity';
import { RegisterUsecaseRequest } from '../../../../../domain/usecases/register/register.usercaserequest';
import { UserDBEntity } from '../../entities/user.typeorm.entity';
import { UserRepositoryAdapter } from './user.repository.adapter';
import { UserRepositoryMock } from './user.repository.mock';

describe('UserRepositoryAdapter', () => {
  let userRepository: Repository<UserDBEntity>;
  let adapter: UserRepositoryAdapter;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(UserDBEntity),
          useClass: UserRepositoryMock,
        },
        UserRepositoryAdapter,
      ],
    }).compile();
    userRepository = moduleRef.get<Repository<UserDBEntity>>(
      getRepositoryToken(UserDBEntity),
    );
    adapter = moduleRef.get<UserRepositoryAdapter>(UserRepositoryAdapter);
  });

  it('DI must resolve all component', async () => {
    expect.assertions(2);
    expect(userRepository).toBeDefined();
    expect(adapter).toBeDefined();
  });

  describe('createUser function', () => {
    afterEach(async () => {
      await jest.clearAllMocks();
    });
    const mockRegisterRequest: RegisterUsecaseRequest = {
      email: 'email',
      familyName: 'familyName',
      givenName: 'givenName',
      password: 'password',
    };

    const createUserDBEntity = (
      params: RegisterUsecaseRequest = mockRegisterRequest,
    ): UserDBEntity => {
      const user = new UserDBEntity();
      user.id = '1';
      user.email = mockRegisterRequest.email;
      user.familyName = mockRegisterRequest.familyName;
      user.givenName = mockRegisterRequest.givenName;
      user.password = mockRegisterRequest.password;
      return user;
    };
    it('must call UserRepository for adding new record ', async () => {
      expect.assertions(3);
      const mockUserDBEntity: UserDBEntity = createUserDBEntity();
      const { id, ...expectedCreateParams } = mockUserDBEntity;
      jest.spyOn(userRepository, 'exist').mockResolvedValue(false);
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUserDBEntity);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUserDBEntity);
      await adapter.createUser(mockRegisterRequest);
      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith(expectedCreateParams);
      expect(userRepository.save).toHaveBeenCalledWith(mockUserDBEntity);
    });

    it('must return userEntity build with userRepo createUser result', async () => {
      expect.assertions(2);
      const mockUserDBEntity = createUserDBEntity();
      jest.spyOn(userRepository, 'exist').mockResolvedValue(false);
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUserDBEntity);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUserDBEntity);
      const response: UserEntity | Error = await adapter.createUser(
        mockRegisterRequest,
      );
      expect(response instanceof UserEntity).toBe(true);
      expect(response).toStrictEqual(
        new UserEntity(
          mockUserDBEntity.id,
          mockUserDBEntity.email,
          mockUserDBEntity.familyName,
          mockUserDBEntity.givenName,
          mockUserDBEntity.password,
        ),
      );
    });

    it("must return an error if userRepo can't create user", async () => {
      expect.assertions(1);
      const expectedError = new Error('An error occured creating user');
      const mockUserDBEntity = createUserDBEntity();
      jest.spyOn(userRepository, 'exist').mockResolvedValue(false);
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUserDBEntity);
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValue(new Error('any error'));
      const response: UserEntity | Error = await adapter.createUser(
        mockRegisterRequest,
      );
      expect(response).toStrictEqual(expectedError);
    });

    it('must return an error if attempting to create a user with an already registered email', async () => {
      expect.assertions(4);
      jest.spyOn(userRepository, 'exist').mockResolvedValue(true);
      jest.spyOn(userRepository, 'create');
      jest.spyOn(userRepository, 'save');
      const response: UserEntity | Error = await adapter.createUser(
        mockRegisterRequest,
      );
      expect(userRepository.exist).toHaveBeenCalledWith({
        where: { email: mockRegisterRequest.email },
      });
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
      expect(response).toStrictEqual(new Error('User already register'));
    });
  });

  describe('getUser function', () => {
    it('must call UserRepository findOneBy function', async () => {
      expect.assertions(2);
      const expectedEmail = 'firstname.lastname@thetribe.io';
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(new UserDBEntity());
      await adapter.getUser({ email: expectedEmail });
      expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: expectedEmail,
      });
    });

    it('must return userEntity build from UserRepository findOneBy result', async () => {
      expect.assertions(1);
      const mockUserTypeOrm = new UserDBEntity();
      mockUserTypeOrm.email = 'email';
      mockUserTypeOrm.familyName = 'familyName';
      mockUserTypeOrm.givenName = 'givenName';
      mockUserTypeOrm.id = '1';
      mockUserTypeOrm.password = 'pmlloiugfgh';
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValue(mockUserTypeOrm);
      const result: UserEntity | Error = await adapter.getUser({
        email: 'email',
      });
      expect(result).toStrictEqual(
        new UserEntity(
          mockUserTypeOrm.id,
          mockUserTypeOrm.email,
          mockUserTypeOrm.familyName,
          mockUserTypeOrm.givenName,
          mockUserTypeOrm.password,
        ),
      );
    });

    it('must return an exception if no user found', async () => {
      expect.assertions(1);
      const expectedError = new Error('No user found');
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      await expect(adapter.getUser({ email: '' })).resolves.toStrictEqual(
        expectedError,
      );
    });
  });
});
