import { UpdatePasswordUseCase } from "@/users/application/usecases/update-password.usecase";
import { IsString, IsNotEmpty } from "class-validator";

export class UpdatePasswordDto implements Omit<UpdatePasswordUseCase.Input, 'id'> {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}
