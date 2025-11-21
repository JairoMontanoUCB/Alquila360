import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {

  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
