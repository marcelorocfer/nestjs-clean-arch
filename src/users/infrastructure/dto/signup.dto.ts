import { SignupUseCase } from "@/users/application/usecases/signup.usecase";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignupDto implements SignupUseCase.Input {
  @ApiProperty({ description: 'Nome do Usuário' })
  @IsString()
  @IsNotEmpty()
  name: string;

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
