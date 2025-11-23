// create-expensa.dto.ts
import { IsNumber, IsDateString, IsPositive, IsInt } from 'class-validator';

export class CreateExpensaDto {
  // Nota: Asumiendo que las expensas se asignan a un contrato específico
  @IsInt()
  contratoId: number; 

  @IsDateString()
  fechaVencimiento: Date;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  monto: number;
}