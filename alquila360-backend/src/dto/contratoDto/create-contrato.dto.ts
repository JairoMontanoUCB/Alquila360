import { IsDate, IsNumber, IsString, IsOptional, IsInt, Min, MinDate } from 'class-validator';
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
  @MinDate(new Date())
  fecha_fin: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monto_mensual: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  garantia?: number;

  @IsOptional()
  @IsString()
  archivo_pdf?: string;
}