import { IsString, IsNumber } from "class-validator";

export class TicketFotoDto {
  @IsString()
  url: string;

  @IsNumber()
  ticketId: number;
}
