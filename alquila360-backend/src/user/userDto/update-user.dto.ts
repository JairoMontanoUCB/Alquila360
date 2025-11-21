import { IsEmail, IsOptional, IsString, IsEnum, MinLength } from 'class-validator';

export class UpdateUserDto {
  
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(['administrador', 'propietario', 'inquilino', 'tecnico'])
  rol?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;
}
