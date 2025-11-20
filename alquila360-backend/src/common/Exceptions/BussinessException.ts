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