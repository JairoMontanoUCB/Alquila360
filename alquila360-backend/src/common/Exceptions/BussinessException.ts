import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
    constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
        super(message, status);
    }
}

export class PropiedadNoEncontradaException extends BusinessException {
    constructor(propiedadId: number) {
        super(`Propiedad con ID ${propiedadId} no encontrada`);
    }
}

export class PropiedadNoDisponibleException extends BusinessException {
    constructor(propiedadId: number, estado: string) {
        super(`La propiedad ${propiedadId} no está disponible (estado: ${estado})`);
    }
}

export class UsuarioNoInquilinoException extends BusinessException {
    constructor(usuarioId: number, rol: string) {
        super(`El usuario ${usuarioId} no es un inquilino (rol: ${rol})`);
    }
}

export class UsuarioNoActivoException extends BusinessException {
    constructor(usuarioId: number, estado: string) {
        super(`El usuario ${usuarioId} no está activo (estado: ${estado})`);
    }
}

export class CuotaNoEncontradaException extends BusinessException {
    constructor(cuotaId: number) {
        super(`Cuota con ID ${cuotaId} no encontrada`);
    }
}

export class CuotaNoPendienteException extends BusinessException {
    constructor(cuotaId: number, estado: string) {
        super(`La cuota ${cuotaId} no está pendiente (estado: ${estado})`);
    }
}

export class MontoNoCoincideException extends BusinessException {
    constructor(montoPago: number, montoCuota: number) {
        super(`El monto del pago (${montoPago}) no coincide con el monto de la cuota (${montoCuota})`);
    }
}