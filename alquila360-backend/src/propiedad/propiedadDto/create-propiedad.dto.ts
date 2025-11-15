import { IsString, IsNumber, IsOptional } from "class-validator";

export class CreatePropiedadDto {
  @IsString()
  direccion: string;

  @IsString()
  ciudad: string;

  @IsString()
  tipo: string; // ejemplo: "departamento", "casa", "local"

  @IsString()
  estado: string; // ejemplo: "disponible", "ocupado", "mantenimiento"

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  precio_referencia: number;

  @IsNumber()
  propietarioId: number;
}
