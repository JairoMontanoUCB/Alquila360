import { IsInt, IsNotEmpty } from 'class-validator';

export class AsignarTecnicoDto {
  @IsNotEmpty()
  @IsInt()
  tecnicoId: number;
}