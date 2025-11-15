export class PagoResponseDto {
  id: number;
  id_contrato: number;
  fecha_pago: Date;
  monto: number;
  medio_pago: string;
  recibo_numero?: string;
  ruta_pdf?: string;
}
