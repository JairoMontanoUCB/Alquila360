import { Inject, Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Contrato } from "src/entity/contrato.entity";
import { User } from "src/entity/user.entity";
import { Propiedad } from "src/entity/propiedad.entity";
import { DataSource } from "typeorm";
import { CreateContratoDto } from "src/auth/dto/contratoDto/create-contrato.dto";
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ContratoService {
    async createContrato(contrato:Contrato)
    {
        return await AppDataSource.getRepository(Contrato).save(contrato);
    }

    async getAllContrato()
    {
        return await AppDataSource.getRepository(Contrato).find();
    }
    async getContratoById(id:number)
    {
        return await AppDataSource.getRepository(Contrato).findOneBy({id}); 
    }
    async updateContrato(id:number, contratoData : Partial<Contrato>)
    {
        return await AppDataSource.getRepository(Contrato).update(id, contratoData);
        return this.getContratoById(id);
    }
    async deleteContrato(id:number)
    {
        return await AppDataSource.getRepository(Contrato).delete(id);
    }

    async RegistrarUsuarioContrato(contratoDto: CreateContratoDto){

        // Validar DTO
        const errors = await validate(contratoDto);
        if (errors.length > 0) {
            const errorMessages = errors.map(error => 
                error.constraints ? Object.values(error.constraints) : ['Error de validación']
            ).flat();
            throw new Error(`Datos inválidos: ${errorMessages.join(', ')}`);
        }

        var { inquilinoId, propiedadId, monto_mensual, fecha_inicio, fecha_fin } = contratoDto;
        
        // Conseguir Inquilino
        var AuxUsuario = await AppDataSource.getRepository(User).findOneBy({ id: inquilinoId });
        if ( AuxUsuario == null) {
            throw new Error('Usuario no encontrado');
        }
        if ( AuxUsuario.rol != 'inquilino') {
            throw new Error('El usuario no es un inquilino');
        }
        if ( AuxUsuario.estado != 'activo') {
            throw new Error('El usuario no está activo');
        }

        // Conseguir Propiedad
        var AuxPropiedad = await AppDataSource.getRepository(Propiedad).findOneBy({ id: propiedadId });
        if ( AuxPropiedad == null) {
            throw new Error('Propiedad no encontrada');
        }
        if ( AuxPropiedad.estado != 'disponible') {
            throw new Error('La propiedad no está disponible');
        }

        // Configurar contrato

            // Fechas 
        if (fecha_fin <= fecha_inicio) {
            throw new Error('La fecha de fin debe ser mayor a la fecha de inicio');
        }
        if (fecha_inicio < new Date()) {
            throw new Error('La fecha de inicio no puede ser en el pasado');
        }

            // Monto mensual

        if (monto_mensual <= 0) {
            throw new Error('El monto mensual debe ser mayor a 0');
        }

        // Calcular garantia

        var mesesDuracion = this.CalcularMesesContrato(fecha_inicio, fecha_fin);
        var garantia = this.CalcularGarantia(monto_mensual, AuxPropiedad.tipo, mesesDuracion);

        //Se guarda la configuracion

        const contrato = new Contrato();

        contrato.inquilino = AuxUsuario;
        contrato.propiedad = AuxPropiedad;
        contrato.fecha_inicio = fecha_inicio;
        contrato.fecha_fin = fecha_fin;
        contrato.monto_mensual = monto_mensual; 
        contrato.garantia = garantia;
        //FALTA PDF
        return await AppDataSource.getRepository(Contrato).save(contrato);
    }
    
    CalcularMesesContrato(fechaInicio: Date, fechaFin: Date): number {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        
        const diferenciaMs = fin.getTime() - inicio.getTime();
        
        // Convertir a meses
        const meses = diferenciaMs / (1000 * 60 * 60 * 24 * 30.44);
        
        // Redondear hacia arriba para contar meses completos
        return Math.ceil(meses);
    }

    CalcularGarantia (monto: number, tipoPropiedad: string, Meses:number): number {
        var porcentaje;

        switch (tipoPropiedad) {
            case "departamento":
                porcentaje = 1; // 100% para departamentos
                break;
            case "casa":
                porcentaje = 1.5; // 150% para casas";
                break;
            case "local":
                porcentaje = 2; // 200% para locales comerciales
                break;
            case "oficina":
                porcentaje = 1.5; // 150% para oficinas
                break;
            default:
                porcentaje = 1; // 100% para otros tipos de propiedad
                break;
        }
        
        var factorMultiplicador; 

        if (Meses < 6) factorMultiplicador = 1.2; 
        else if (Meses <= 12) factorMultiplicador = 1;
        else if (Meses <= 24) factorMultiplicador = 0.7;
        else factorMultiplicador = 0.5;
        

        var porcentajeFinal = factorMultiplicador * porcentaje;

        return monto * porcentajeFinal; // La garantia se calcula en base al monto mensual y la cantidad de meses
    }
}