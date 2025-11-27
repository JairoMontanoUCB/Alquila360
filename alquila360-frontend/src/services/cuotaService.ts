import axios from "@/app/utils/axios.util";

export interface CuotaBackend {
  id: number;
  numero_referencia: string;
  fecha_vencimiento: string;
  monto: number;
  estado: "pendiente" | "pagada" | "vencida";
  fecha_pago?: string | null;
  tipo: "ALQUILER" | "EXPENSA";
}

export const cuotaService = {
  // Cuotas de alquiler
  async getCuotasPorContrato(contratoId: number): Promise<CuotaBackend[]> {
    const res = await axios.get(`/cuotas/contrato/${contratoId}`);
    return res.data;
  },

  // Expensas
  async getExpensasPorContrato(contratoId: number): Promise<CuotaBackend[]> {
    const res = await axios.get(`/cuotas/expensas/contrato/${contratoId}`);
    return res.data;
  },

  // Pagar cuota
  async pagarCuota(cuotaId: number, fechaPago: string) {
    const res = await axios.put(`/cuotas/${cuotaId}/estado`, {
      estado: "pagada",
      fecha_pago: fechaPago,
    });
    return res.data;
  }
};
