import { IsInt, Min, Max, IsString, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class RatePropiedadDto {

  @Type(() => Number)
  @IsInt()
  autorId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1, { message: "estrellas must not be less than 1" })
  @Max(5, { message: "estrellas must not be greater than 5" })
  estrellas: number;

  @IsOptional()
  @IsString()
  comentario?: string;
}
