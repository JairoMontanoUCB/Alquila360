export class CreateExpensaDto {
  tipo_servicio: string; // ejemplo: "Limpieza", "Agua", "Guardia"
  descripcion: string;
  monto: number;
  propiedadId: number;
  contratoId: number;
}
