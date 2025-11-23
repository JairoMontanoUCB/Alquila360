import { IsInt, Min, Max, IsOptional, IsString } from "class-validator";

export class RateUserDto {
  @IsInt()
  @Min(1)
  @Max(5)
  estrellas: number;

  @IsOptional()
  @IsString()
  comentario?: string;

  @IsInt()
  autorId: number;
}
