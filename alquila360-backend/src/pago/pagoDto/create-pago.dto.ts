import { IsNumber, IsString, IsDateString, IsOptional, IsEnum } from "class-validator";

export class CreatePagoDto {
  @IsNumber()
  id_contrato: number;

  @IsDateString()
  fecha_pago: string;

  @IsNumber()
  monto: number;

  @IsEnum(["efectivo", "transferencia", "qr", "otro"])
  medio_pago: "efectivo" | "transferencia" | "qr" | "otro";

  @IsOptional()
  @IsString()
  recibo_numero?: string;
}
