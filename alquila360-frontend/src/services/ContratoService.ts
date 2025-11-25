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

export type CreateContratoDto = {
  inquilinoId: number;
  propiedadId: number;
  monto_mensual: number;
  fecha_inicio: string;
  fecha_fin: string;
};

export type UpdateContratoDto = {
  propiedadId?: number;
  inquilinoId?: number;
  monto_mensual?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  garantia?: number;
  estado?: string;
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
    // Contratos 
    async getContratos(): Promise<ContratoBackend[]> {
      const response = await api.get('/contrato');
      return response.data;
    },
  
    async getContratoById(id: number): Promise<ContratoBackend> {
      const response = await api.get(`/contrato/${id}`);
      return response.data;
    },
  
    async registrarContrato(contratoData: CreateContratoDto): Promise<ContratoBackend> {
      const response = await api.post('/contrato/registrar', contratoData);
      return response.data;
    },
  
    async finalizarContrato(id: number): Promise<any> {
      const response = await api.post(`/contrato/TerminarContrato/${id}`);
      return response.data;
    },
  
    async updateContrato(id: number, contratoData: UpdateContratoDto): Promise<ContratoBackend> {
      const response = await api.put(`/contrato/${id}`, contratoData);
      return response.data;
    },
    
    async getContratosPorPropietario(propietarioId: number): Promise<ContratoBackend[]> {
      const response = await api.get(`/contrato/propietario/${propietarioId}`);
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
  
    // Inquilinos 
    async getInquilinos(): Promise<InquilinoBackend[]> {
      const response = await api.get('/user/rol/inquilinos');
      return response.data;
    },
  
    async getPropietarios(): Promise<InquilinoBackend[]> {
      const response = await api.get('/user/rol/propietarios');
      return response.data;
    },
  
    async getUsuariosActivos(): Promise<InquilinoBackend[]> {
      const response = await api.get('/user/activos');
      return response.data;
    }
  };