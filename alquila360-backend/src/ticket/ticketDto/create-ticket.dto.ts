import { IsString, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class CreateTicketDto {

  @Type(() => Number)
  @IsNumber()
  propiedadId: number;

  @IsString()
  descripcion: string;
}
