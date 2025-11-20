import { IsString, IsNumber, IsEnum, IsDateString, IsOptional } from "class-validator";

export class CreateTicketDto {
  @IsNumber()
  propiedadId: number;

  @IsNumber()
  inquilinoId: number;

  @IsString()
  descripcion: string;

  @IsEnum(["roja", "naranja", "verde"])
  prioridad: "roja" | "naranja" | "verde";

  @IsEnum(["pendiente", "en_proceso", "resuelto", "cerrado"])
  estado: string;

  @IsOptional()
  @IsDateString()
  fecha_limite?: string;

  @IsOptional()
  tecnico_asignadoId?: number;

  @IsOptional()
  UrlFoto?: string[];
}
