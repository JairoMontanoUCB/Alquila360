export class ResponseContratoDto {
    id: number;
    fecha_inicio: Date;
    fecha_fin: Date;
    monto_mensual: number;
    garantia: number;
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
    archivo_pdf: string;
  }