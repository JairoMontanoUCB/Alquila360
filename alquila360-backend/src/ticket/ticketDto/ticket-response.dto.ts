export class TicketResponseDto {
  id: number;
  descripcion: string;
  prioridad: string;
  estado: string;
  fecha_limite?: Date;
  propiedadId: number;
  contratoId: number;
  inquilinoId: number;
  tecnico_asignadoId?: number;
}
