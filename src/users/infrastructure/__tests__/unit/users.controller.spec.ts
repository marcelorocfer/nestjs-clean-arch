import { UsersController } from '../../users.controller';
import { UserOutput } from '@/users/application/dto/user-output';
import { SignupUseCase } from '@/users/application/usecases/signup.usecase';
import { SignupDto } from '../../dto/signup.dto';
import { SigninUseCase } from '@/users/application/usecases/signin.usecase';
import { SigninDto } from '../../dto/signin.dto';
import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UpdatePasswordUseCase } from '@/users/application/usecases/update-password.usecase';
import { UpdatePasswordDto } from '../../dto/update-password.dto';
import { GetUserUseCase } from '@/users/application/usecases/get-user.usecase';

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
    const result = await sut.create(input);
    expect(output).toMatchObject(result);
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input);
    expect(mockSignupUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('should authenticate a user', async () => {
    const output: SigninUseCase.Output = props;
    const mockSigninUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['signinUseCase'] = mockSigninUseCase as any;
    const input: SigninDto = {
      email: 'a@a.com',
      password: '1234',
    };
    const result = await sut.login(input);
    expect(output).toMatchObject(result);
    expect(mockSigninUseCase.execute).toHaveBeenCalledWith(input);
    expect(mockSigninUseCase.execute).toHaveBeenCalledTimes(1);
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
    const result = await sut.update(id, input);
    expect(output).toMatchObject(result);
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
    const result = await sut.updatePassword(id, input);
    expect(output).toMatchObject(result);
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

    const result = await sut.findOne(id);
    expect(output).toStrictEqual(result);
    expect(mockGetUserUseCase.execute).toHaveBeenCalledWith({ id });
    expect(mockGetUserUseCase.execute).toHaveBeenCalledTimes(1);
  });
});
