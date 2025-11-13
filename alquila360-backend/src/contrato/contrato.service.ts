import { Inject, Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Contrato } from "src/entity/contrato.entity";
import { User } from "src/entity/user.entity";
import { Propiedad } from "src/entity/propiedad.entity";
import { DataSource } from "typeorm";

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

    async RegistrarUsuarioContrato(contrato: Contrato, usuarioId: number, propiedadId: number, monto_mensual: number, fecha_inicio: Date, fecha_fin: Date){

        // Conseguir Inquilino
        var AuxUsuario = await AppDataSource.getRepository(User).findOneBy({ id: usuarioId });
        if ( AuxUsuario == null) {
            throw new Error('Usuario no encontrado');
        }
        if ( AuxUsuario.rol != 'Inquilino') {
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

        //Se guarda la configuracion
        contrato.inquilino = await AuxUsuario;
        contrato.propiedad = await AuxPropiedad;
        contrato.fecha_inicio = fecha_inicio;
        contrato.fecha_fin = fecha_fin;
        contrato.monto_mensual = monto_mensual; 
        return await AppDataSource.getRepository(Contrato).save(contrato);
    }

    CalcularMesesDuracion (fecha_inicio: Date, fecha_fin: Date): number { // EN TRABAJO
        var inicio = new Date(fecha_inicio);
        var fin = new Date(fecha_fin);

        let meses = (fin.getFullYear() - inicio.getFullYear()) * 12;
        meses -= inicio.getMonth();
        meses += fin.getMonth();

        // Si el día del mes de la fecha de fin es menor al de la fecha de inicio, se resta un mes
        if (fin.getDate() < inicio.getDate()) {
            meses--;
        }
        return meses <= 0 ? 0 : meses;
    } 

    CalcularGarantia (monto: number, tipoPropiedad: "departamento" | "casa" | "local" | "oficina" | "otros"): number {
        var porcentaje:number;
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
        return monto * porcentaje; // La garantia se calcula en base al monto mensual y es el 7% del mismo
    }
}