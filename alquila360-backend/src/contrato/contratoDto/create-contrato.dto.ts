import { IsDate, IsNumber, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContratoDto {
  @IsInt()
  @Min(1)
  propiedadId: number;

  @IsInt()
  @Min(1)
  inquilinoId: number;

  @IsDate()
  @Type(() => Date)
  fecha_inicio: Date;

  @IsDate()
  @Type(() => Date)
  fecha_fin: Date;

  @IsNumber()
  @Min(1)
  monto_mensual: number;

  @IsOptional()
  archivo_pdf?: string;
}
