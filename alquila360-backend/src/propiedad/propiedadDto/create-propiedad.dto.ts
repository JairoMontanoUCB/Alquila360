import { IsString, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreatePropiedadDto {
  @IsString()
  direccion: string;

  @IsString()
  ciudad: string;

  @IsString()
  tipo: string; // departamento, casa, local, oficina...

  @IsOptional()
  @IsString()
  descripcion?: string;

  @Type(() => Number)
  @IsNumber()
  precio_referencia: number;

  @Type(() => Number)
  @IsNumber()
  propietarioId: number;
}
