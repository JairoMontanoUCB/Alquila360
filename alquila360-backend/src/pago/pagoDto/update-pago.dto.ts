import { PartialType } from "@nestjs/mapped-types";
import { CreatePagoDto } from "./create-pago.dto";
import { IsDate, IsNumber, IsString, IsOptional, Min, IsDateString, IsEnum } from 'class-validator';
import { Type } from "class-transformer";

export class UpdatePagoDto extends PartialType(CreatePagoDto) {
    @IsOptional() 
    @IsDate()
    @Type(() => Date)
    fecha_pago: Date;
    
    @IsOptional() 
    @IsNumber()
    @Min(1)
    monto: number;
    
    @IsOptional() 
    @IsEnum(["efectivo", "transferencia", "qr", "otro"])
    medio_pago: "efectivo" | "transferencia" | "qr" | "otro";


}
