// services/PropiedadService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
  ratingPromedio?: number;
  ratingTotal?: number;
  ratingCount?: number;
  fotos?: PropiedadFoto[];
  superficie?: number;
  ambientes?: number;
  servicios?: string[];
};

export type PropiedadFoto = {
  id: number;
  url: string;
  propiedadId: number;
};

export type CreatePropiedadDto = {
  direccion: string;
  ciudad: string;
  tipo: string;
  estado: string;
  descripcion: string;
  precio_referencia: number;
  propietarioId: number;
  superficie?: number;
  ambientes?: number;
  servicios?: string[];
};

export type UpdatePropiedadDto = {
  direccion?: string;
  ciudad?: string;
  tipo?: string;
  estado?: string;
  descripcion?: string;
  precio_referencia?: number;
  superficie?: number;
  ambientes?: number;
  servicios?: string[];
};

export type RatePropiedadDto = {
  rating: number;
  comentario?: string;
  userId: number;
};

export const getPropiedadesDeInquilino = async (userId: number) => {
  const res = await axios.get(`/propiedad/inquilino/${userId}`);
  return res.data;
};

export const propiedadService = {
  // Obtener todas las propiedades
  async getPropiedades(): Promise<PropiedadBackend[]> {
    const response = await api.get('/propiedad');
    return response.data;
  },

  // Obtener propiedad por ID
  async getPropiedadById(id: number): Promise<PropiedadBackend> {
    const response = await api.get(`/propiedad/${id}`);
    return response.data;
  },

  // Obtener propiedades disponibles para contratos
  async getPropiedadesDisponibles(): Promise<PropiedadBackend[]> {
    const response = await api.get('/propiedad/disponibles/contratos');
    return response.data;
  },

  // Crear nueva propiedad (sin imágenes por ahora)
  async crearPropiedad(propiedadData: CreatePropiedadDto): Promise<PropiedadBackend> {
    const response = await api.post('/propiedad/crear', propiedadData);
    return response.data;
  },

  // Crear propiedad con imágenes (si necesitas subir archivos)
  async crearPropiedadConImagenes(formData: FormData): Promise<PropiedadBackend> {
    const response = await api.post('/propiedad/crear', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Actualizar propiedad
  async actualizarPropiedad(id: number, propiedadData: UpdatePropiedadDto): Promise<PropiedadBackend> {
    const response = await api.put(`/propiedad/${id}`, propiedadData);
    return response.data;
  },

  // Eliminar propiedad
  async eliminarPropiedad(id: number): Promise<void> {
    await api.delete(`/propiedad/${id}`);
  },

  // Calificar propiedad
  async calificarPropiedad(id: number, ratingData: RatePropiedadDto): Promise<PropiedadBackend> {
    const response = await api.post(`/propiedad/${id}/calificar`, ratingData);
    return response.data;
  },

  // Obtener propiedades por propietario (si tienes este endpoint)
  async getPropiedadesPorPropietario(propietarioId: number): Promise<PropiedadBackend[]> {
    const response = await api.get(`/propiedad/propietario/${propietarioId}`);
    return response.data;
  },
  // Subir fotos a una propiedad existente
    async subirFotosPropiedad(id: number, formData: FormData): Promise<PropiedadBackend> {
        const response = await api.post(`/propiedad/${id}/fotos`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        });
    return response.data;
  },
  
  // Eliminar foto de una propiedad
  async eliminarFotoPropiedad(propiedadId: number, fotoId: number): Promise<void> {
    await api.delete(`/propiedad/${propiedadId}/fotos/${fotoId}`);
  },
  
};