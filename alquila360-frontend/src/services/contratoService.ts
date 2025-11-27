import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* -------------------------------------------------------------------------- */
/*                                   TIPOS                                    */
/* -------------------------------------------------------------------------- */

export type ContratoBackend = {
  id: number;
  fecha_inicio: string;
  fecha_fin: string;
  monto_mensual: number;
  garantia: number;
  estado: string;
  archivo_pdf?: string;
  id_propiedad: number;
  inquilino: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  };
  propiedad: {
    id: number;
    direccion: string;
    tipo: string;
    propietario: {
      id: number;
      nombre: string;
      apellido: string;
      email: string;
    };
  };
};

export type PropiedadBackend = {
  id: number;
  direccion: string;
  ciudad: string;
  tipo: string;
  estado: string;
  descripcion: string | null;
  precio_referencia: number;
  propietario: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
  };
};

export type InquilinoBackend = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  estado: string;
};

/* -------------------------------------------------------------------------- */
/*                                  SERVICE                                   */
/* -------------------------------------------------------------------------- */

export const contratoService = {
  /** Obtener contrato actual del inquilino */
  async getContratoActual(userId: number): Promise<ContratoBackend> {
  const response = await api.get(`/contrato/actual/${userId}`);
  return response.data;
},


  /** Obtener TODOS los contratos */
  async getContratos(): Promise<ContratoBackend[]> {
    const response = await api.get('/contrato');
    return response.data;
  },

  /** Obtener contrato por ID */
  async getContratoById(id: number): Promise<ContratoBackend> {
    const response = await api.get(`/contrato/${id}`);
    return response.data;
  },

  /** Obtener contratos por propietario */
  async getContratosPorPropietario(propietarioId: number): Promise<ContratoBackend[]> {
    const response = await api.get(`/contrato/propietario/${propietarioId}`);
    return response.data;
  },

  /** Obtener propiedades */
  async getPropiedadesDisponibles(): Promise<PropiedadBackend[]> {
    const response = await api.get('/propiedad/disponibles/contratos');
    return response.data;
  },

  async getPropiedades(): Promise<PropiedadBackend[]> {
    const response = await api.get('/propiedad');
    return response.data;
  },

  /** Descargar PDF */
  async descargarContratoPDF(id: number): Promise<void> {
    const response = await api.get(`/contrato/${id}/pdf`, {
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `contrato-${id}.pdf`;
    link.click();

    window.URL.revokeObjectURL(url);
  }
};
