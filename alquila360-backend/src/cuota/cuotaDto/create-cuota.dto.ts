import { IsDate, IsNumber, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCuotaDto {
  @IsInt()
  @Min(1)
  contrato_id: number;

  @IsString()
  numero_referencia: string;

  @IsDate()
  @Type(() => Date)
  fecha_vencimiento: Date;

  @IsNumber()
  @Min(0)
  monto: number;

  @IsEnum(["pendiente", "pagada", "vencida"])
  estado: string;
}