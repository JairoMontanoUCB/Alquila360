import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsEnum(['administrador', 'propietario', 'inquilino', 'tecnico'])
  rol: string;

  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
