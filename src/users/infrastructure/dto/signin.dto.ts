import { SigninUseCase } from "@/users/application/usecases/signin.usecase";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SigninDto implements SigninUseCase.Input {
  @ApiProperty({ description: 'E-mail do Usuário' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do Usuário' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
