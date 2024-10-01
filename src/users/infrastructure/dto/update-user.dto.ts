import { UpdateUserUseCase } from "@/users/application/usecases/update-user.usecase";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  @ApiPropertyOptional({ description: 'Nome do usuário' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
