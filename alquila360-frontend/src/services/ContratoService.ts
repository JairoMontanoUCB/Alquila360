import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type ContratoBackend = {
  id: number;
  fecha_inicio: string;
  fecha_fin: string;
  monto_mensual: number;
  garantia: number;
  estado: string;
  archivo_pdf?: string;
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
  inquilino: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  };
};

export type CreateContratoDto = {
  inquilinoId: number;
  propiedadId: number;
  monto_mensual: number;
  fecha_inicio: string;
  fecha_fin: string;
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
  // Agrega estos campos si existen en tu frontend
  telefono?: string;
  dni?: string;
  fecha_registro?: string;
};

export type PropietarioBackend = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  estado: string;
};
//Contratos

  // Obtener todos los contratos
export const contratoService = {
  async getContratos(): Promise<ContratoBackend[]> {
    const response = await api.get('');
    return response.data;
  },

  // Obtener contrato por ID
  async getContratoById(id: number): Promise<ContratoBackend> {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  // Registrar nuevo contrato
  async registrarContrato(contratoData: CreateContratoDto): Promise<ContratoBackend> {
    const response = await api.post('/registrar', contratoData);
    return response.data;
  },

  // Finalizar contrato
  async finalizarContrato(id: number): Promise<any> {
    const response = await api.post(`/TerminarContrato/${id}`);
    return response.data;
  },

// Propiedades

  async getPropiedadesDisponibles(): Promise<PropiedadBackend[]> {
    const response = await api.get('/propiedad/disponibles/contratos');
    return response.data;
  },

  async getPropiedades(): Promise<PropiedadBackend[]> {
    const response = await api.get('/propiedad');
    return response.data;
  },
// Inquilinos y Propietarios

  async getInquilinos(): Promise<InquilinoBackend[]> {
    const response = await api.get('/user/rol/inquilinos');
    return response.data;
  },

  async getPropietarios(): Promise<PropietarioBackend[]> {
    const response = await api.get('/user/rol/propietarios');
    return response.data;
  },

  async getUsuariosActivos(): Promise<(InquilinoBackend | PropietarioBackend)[]> {
    const response = await api.get('/user/activos');
    return response.data;
  }
  

  // Obtener propietarios activos
  
};