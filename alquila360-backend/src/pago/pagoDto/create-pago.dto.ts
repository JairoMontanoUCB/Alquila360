import { IsNumber, IsInt, IsString, IsDate, IsOptional, IsEnum, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreatePagoDto {
  @IsNumber()
  @Min(1)
  id_contrato: number;

  @IsDate()
  @Type(() => Date)
  fecha_pago: Date;

  @IsNumber()
  @Min(1)
  monto: number;

  @IsEnum(["efectivo", "transferencia", "qr", "otro"])
  medio_pago: "efectivo" | "transferencia" | "qr" | "otro";

  @IsOptional()
  @IsString()
  recibo_numero?: string;
}
