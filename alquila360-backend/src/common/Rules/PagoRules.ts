import { BusinessException } from '../Exceptions/BussinessException';
import AppDataSource from "src/data-source";
import { Pago } from "src/entity/pago.entity";
import { Contrato } from "src/entity/contrato.entity";
import { User } from "src/entity/user.entity";
import { Propiedad } from "src/entity/propiedad.entity";

export class PagoRules {
    
    static async validarContrato(contratoId: number): Promise<Contrato> {
        const contrato = await AppDataSource.getRepository(Contrato).findOneBy({ id: contratoId });
        
        if (!contrato) {
            throw new BusinessException(`Contrato con ID ${contratoId} no encontrado`);
        }
        
        return contrato;
    }

    static async validarPropiedad(propiedadId: number): Promise<Propiedad> {
        const propiedad = await AppDataSource.getRepository(Propiedad).findOneBy({ id: propiedadId });
        
        if (!propiedad) {
            throw new BusinessException(`Propiedad con ID ${propiedadId} no encontrada`);
        }
        
        return propiedad;
    }

    static async validarPropiedadDelContrato(contrato: Contrato): Promise<Propiedad> {
        if (!contrato.id_propiedad) {
            throw new BusinessException(`El contrato ${contrato.id} no tiene una propiedad asociada`);
        }
        
        return await this.validarPropiedad(contrato.id_propiedad);
    }

    static async validarInquilino(inquilinoId: number): Promise<User> {
        const usuario = await AppDataSource.getRepository(User).findOneBy({ id: inquilinoId });
        
        if (!usuario) {
            throw new BusinessException(`Usuario con ID ${inquilinoId} no encontrado`);
        }
        if (usuario.estado !== 'activo') {
            throw new BusinessException(`El usuario ${inquilinoId} no está activo (estado: ${usuario.estado})`);
        }
        
        return usuario;
    }

    static validarMonto(monto: number): void {
        if (monto <= 0) {
            throw new BusinessException('El monto del pago debe ser mayor a 0');
        }
        
        if (monto > 999999.99) {
            throw new BusinessException('El monto del pago excede el límite permitido');
        }
    }

    static validarFechaPago(fechaPago: Date): void {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        const fechaPagoDate = new Date(fechaPago);
        fechaPagoDate.setHours(0, 0, 0, 0);
        
        if (fechaPagoDate > hoy) {
            throw new BusinessException('La fecha de pago no puede ser futura');
        }
    }

    static validarMedioPago(medioPago: string): void {
        const mediosPermitidos = ["efectivo", "transferencia", "qr", "otro"];
        
        if (!mediosPermitidos.includes(medioPago)) {
            throw new BusinessException(`Medio de pago '${medioPago}' no válido. Los medios permitidos son: ${mediosPermitidos.join(', ')}`);
        }
    }

    static validarReciboNumero(reciboNumero: string): void {
        if (reciboNumero && reciboNumero.length > 50) {
            throw new BusinessException('El número de recibo no puede exceder los 50 caracteres');
        }
    }

    static async validarPagoExistente(id: number): Promise<Pago> {
        const pago = await AppDataSource.getRepository(Pago).findOneBy({ id });
        
        if (!pago) {
            throw new BusinessException(`Pago con ID ${id} no encontrado`);
        }
        
        return pago;
    }

    static async validarPagoCompleto(pago: Pago): Promise<void> {
        if (!pago) {
            throw new BusinessException('No se pudo cargar el pago completo');
        }

        // Validar relaciones necesarias
        if (!pago.contrato) {
            throw new BusinessException('El pago debe estar asociado a un contrato válido');
        }

        if (!pago.inquilino) {
            throw new BusinessException('El pago debe estar asociado a un inquilino válido');
        }
    }
}