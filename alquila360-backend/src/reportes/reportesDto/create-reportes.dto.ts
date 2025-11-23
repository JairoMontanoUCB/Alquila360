
import { IsString, IsNumber, IsEnum, IsDateString, IsOptional } from "class-validator";


export class CreateReportesDto {
    @IsNumber()       
    usuarioId: number;
    
    @IsString()
    motivo: string;

    @IsString()
    descripcion:  string;
    
    @IsDateString()
    fecha_reporte: Date;



}
