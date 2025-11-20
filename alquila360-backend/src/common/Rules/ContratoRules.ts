import { BusinessException, PropiedadNoEncontradaException, PropiedadNoDisponibleException, UsuarioNoInquilinoException, 
UsuarioNoActivoException } from '../Exceptions/BussinessException';
import AppDataSource from "src/data-source";
import { User } from "src/entity/user.entity";
import { Propiedad } from "src/entity/propiedad.entity";

export class ContratoRules {
    
    static async validarInquilino(inquilinoId: number): Promise<User> {
        const usuario = await AppDataSource.getRepository(User).findOneBy({ id: inquilinoId });
        
        if (!usuario) {
            throw new BusinessException(`Usuario con ID ${inquilinoId} no encontrado`);
        }
        if (usuario.rol !== 'inquilino') {
            throw new UsuarioNoInquilinoException(inquilinoId, usuario.rol);
        }
        if (usuario.estado !== 'activo') {
            throw new UsuarioNoActivoException(inquilinoId, usuario.estado);
        }
        
        return usuario;
    }

    static async validarPropiedad(propiedadId: number): Promise<Propiedad> {
        const propiedad = await AppDataSource.getRepository(Propiedad).findOneBy({ id: propiedadId });
        
        if (!propiedad) {
            throw new PropiedadNoEncontradaException(propiedadId);
        }
        if (propiedad.estado !== 'disponible') {
            throw new PropiedadNoDisponibleException(propiedadId, propiedad.estado);
        }
        
        return propiedad;
    }

    static validarFechas(fechaInicio: Date, fechaFin: Date): void {
        if (fechaFin <= fechaInicio) {
            throw new BusinessException('La fecha de fin debe ser mayor a la fecha de inicio');
        }
        if (fechaInicio < new Date()) {
            throw new BusinessException('La fecha de inicio no puede ser en el pasado');
        }
    }

    static validarMonto(monto: number): void {
        if (monto <= 0) {
            throw new BusinessException('El monto mensual debe ser mayor a 0');
        }
    }

    static validarGarantia(garantia: number): void {
        if (garantia < 0) {
            throw new BusinessException('La garantía no puede ser negativa');
        }
    }
}