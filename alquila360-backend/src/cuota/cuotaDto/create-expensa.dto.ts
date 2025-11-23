// create-expensa.dto.ts
import { IsNumber, IsDateString, IsPositive, IsInt } from 'class-validator';
import { Type } from 'class-transformer'; 

export class CreateExpensaDto {
  // Nota: Asumiendo que las expensas se asignan a un contrato específico
  @IsInt()
  contratoId: number; 

  //@Type(() => Date)
  @IsDateString()
  fechaVencimiento: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  monto: number;
}