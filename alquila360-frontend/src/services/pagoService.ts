import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface PagoBackend {
  id: number;
  id_contrato: number;
  fecha_pago: string;
  monto: number;
  medio_pago: string;
  recibo_numero?: string;
  ruta_pdf?: string;
  contrato?: {
    id: number;
    propiedad?: {
      direccion: string;
      descripcion: string;
    };
  };
  inquilino?: {
    id: number;
    nombre: string;
    email: string;
  };
  cuota?: {
    id: number;
    numero_referencia: string;
    estado: string;
    fecha_vencimiento: string;
  };
}

export interface CreatePagoDto {
  id_contrato: number;
  cuota_id: number;
  inquilinoId?: number;
  fecha_pago: string;
  monto: number;
  medio_pago: "efectivo" | "transferencia" | "qr" | "otro";
  recibo_numero?: string;
}

class PagoService {
  async getAllPagos(): Promise<PagoBackend[]> {
    const response = await api.get('/pago');
    return response.data;
  }

  async getPagoById(id: number): Promise<PagoBackend> {
    const response = await api.get(`/pago/${id}`);
    return response.data;
  }

  async createPago(pagoData: CreatePagoDto): Promise<PagoBackend> {
    const response = await api.post('/pago', pagoData);
    return response.data;
  }

  async updatePago(id: number, pagoData: Partial<PagoBackend>): Promise<PagoBackend> {
    const response = await api.put(`/pago/${id}`, pagoData);
    return response.data;
  }

  async deletePago(id: number): Promise<void> {
    await api.delete(`/pago/${id}`);
  }

  async downloadReciboPdf(id: number): Promise<Blob> {
    const response = await api.get(`/pago/descargar/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  
}

export const pagoService = new PagoService();