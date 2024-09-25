import { UserOutput } from '@/users/application/dto/user-output';
import { GetUserUseCase } from '@/users/application/usecases/get-user.usecase';
import { ListUsersUseCase } from '@/users/application/usecases/list-users.usecase';
import { SignupUseCase } from '@/users/application/usecases/signup.usecase';
import { UpdatePasswordUseCase } from '@/users/application/usecases/update-password.usecase';
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase';
import { SigninDto } from '../../dto/signin.dto';
import { SignupDto } from '../../dto/signup.dto';
import { UpdatePasswordDto } from '../../dto/update-password.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserCollectionPresenter, UserPresenter } from '../../presenters/user.presenter';
import { UsersController } from '../../users.controller';

describe('UsersController unit tests', () => {
  let sut: UsersController;
  let id: string;
  let props: UserOutput;

  beforeEach(async () => {
    sut = new UsersController();
    id = '0b040cf5-bd00-4cf0-8142-3efa4db3576f';
    props = {
      id,
      name: 'John Doe',
      email: 'a@a.com',
      password: '1234',
      createdAt: new Date(),
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create a user', async () => {
    const output: SignupUseCase.Output = props;
    const mockSignupUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['signupUseCase'] = mockSignupUseCase as any;
    // jest.spyOn(mockSignupUseCase, 'execute').mockReturnValueOnce(Promise.resolve(output));
    const input: SignupDto = {
      name: 'John Doe',
      email: 'a@a.com',
      password: '1234',
    };
    const presenter = await sut.create(input);
    expect(presenter).toBeInstanceOf(UserPresenter);
    expect(presenter).toStrictEqual(new UserPresenter(output));
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input);
    expect(mockSignupUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should authenticate a user', async () => {
    const output = 'fake_token';
    const mockSigninUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    const mockAuthService = {
      generateJwt: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['signinUseCase'] = mockSigninUseCase as any;
    sut['authService'] = mockAuthService as any;
    const input: SigninDto = {
      email: 'a@a.com',
      password: '1234',
    };
    const result = await sut.login(input);
    expect(result).toEqual(output);
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should update a user', async () => {
    const output: UpdateUserUseCase.Output = props;
    const mockUpdateUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['updateUserUseCase'] = mockUpdateUserUseCase as any;
    const input: UpdateUserDto = {
      name: 'new name',
    };
    const presenter = await sut.update(id, input);
    expect(presenter).toBeInstanceOf(UserPresenter);
    expect(presenter).toStrictEqual(new UserPresenter(output));
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should update a users password', async () => {
    const output: UpdatePasswordUseCase.Output = props;
    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['updatePasswordUseCase'] = mockUpdatePasswordUseCase as any;
    const input: UpdatePasswordDto = {
      password: 'new password',
      oldPassword: 'old password',
    };
    const presenter = await sut.updatePassword(id, input);
    expect(presenter).toBeInstanceOf(UserPresenter);
    expect(presenter).toStrictEqual(new UserPresenter(output));
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should delete a user', async () => {
    const output = undefined;
    const mockDeleteUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['deleteUserUseCase'] = mockDeleteUserUseCase as any;

    const result = await sut.remove(id);
    expect(output).toStrictEqual(result);
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({ id });
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should gets a user', async () => {
    const output: GetUserUseCase.Output = props;
    const mockGetUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['getUserUseCase'] = mockGetUserUseCase as any;

    const presenter = await sut.findOne(id);
    expect(presenter).toBeInstanceOf(UserPresenter);
    expect(presenter).toStrictEqual(new UserPresenter(output));
    expect(mockGetUserUseCase.execute).toHaveBeenCalledWith({ id });
    expect(mockGetUserUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should list users', async () => {
    const output: ListUsersUseCase.Output = {
      items: [props],
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
      total: 1,
    };
    const mockListUsersUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['listUsersUseCase'] = mockListUsersUseCase as any;
    const searchParams = {
      page: 1,
      perPage: 1,
    };
    const presenter = await sut.search(searchParams);
    expect(presenter).toBeInstanceOf(UserCollectionPresenter);
    expect(presenter).toEqual(new UserCollectionPresenter(output));
    expect(mockListUsersUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(mockListUsersUseCase.execute).toHaveBeenCalledTimes(1);
  });
});
