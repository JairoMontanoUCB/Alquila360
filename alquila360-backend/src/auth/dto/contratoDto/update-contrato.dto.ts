// src/auth/dto/contratoDto/update-contrato.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateContratoDto } from './create-contrato.dto';
import { IsDate, IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateContratoDto extends PartialType(CreateContratoDto) {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fecha_inicio?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fecha_fin?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monto_mensual?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  garantia?: number;

  @IsOptional()
  @IsString()
  archivo_pdf?: string;
}