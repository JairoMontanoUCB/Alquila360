import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Contrato } from "src/entity/contrato.entity";
import { User } from "src/entity/user.entity";
import { CuotaService } from "src/cuota/cuota.service";
import { Propiedad } from "src/entity/propiedad.entity";
import { DataSource } from "typeorm";
import { CreateContratoDto } from "./contratoDto/create-contrato.dto";
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PdfKitGeneratorService } from "src/utils/pdf-generator.service";
import { ResponseContratoDto } from "./contratoDto/response-contrato.dto";
import { HTTPRequest } from "puppeteer";
import { ContratoRules } from "src/common/Rules/ContratoRules";
import { Cuota } from "src/entity/cuota.entity";

@Injectable()
export class ContratoService {
    logger: any;
    constructor(private readonly pdfService: PdfKitGeneratorService,private readonly cuotaService: CuotaService) {}

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
        // const errors = await validate(contratoDto);
        // if (errors.length > 0) {
        //     const errorMessages = errors.map(error => 
        //         error.constraints ? Object.values(error.constraints) : ['Error de validación']
        //     ).flat();
        //     throw new Error(`Datos inválidos: ${errorMessages.join(', ')}`);
        // }

        var { inquilinoId, propiedadId, monto_mensual, fecha_inicio, fecha_fin } = contratoDto;
        
        // Conseguir Inquilino
        var AuxUsuario = await ContratoRules.validarInquilino(contratoDto.inquilinoId);

        // Conseguir Propiedad
        var AuxPropiedad = await ContratoRules.validarPropiedad(contratoDto.propiedadId);

        // Configurar contrato

            // Fechas 
        ContratoRules.validarFechas(fecha_inicio, fecha_fin);

            // Monto mensual

        ContratoRules.validarMonto(monto_mensual);

            // Calcular garantia

        var mesesDuracion = this.CalcularMesesContrato(fecha_inicio, fecha_fin);
        var garantia = this.CalcularGarantia(monto_mensual, AuxPropiedad.tipo, mesesDuracion);
        ContratoRules.validarGarantia(garantia);

        //Se guarda la configuracion
        
        const contrato = new Contrato();

        contrato.inquilino = AuxUsuario;
        contrato.propiedad = AuxPropiedad;
        contrato.fecha_inicio = fecha_inicio;
        contrato.fecha_fin = fecha_fin;
        contrato.monto_mensual = monto_mensual; 
        contrato.garantia = garantia;
        contrato.estado = "activo";
        

        var contratoGuardado = await AppDataSource.getRepository(Contrato).save(contrato);

        // GENERAR CUOTAS AUTOMÁTICAMENTE
        try {
        await this.cuotaService.generarCuotasMensuales(contratoGuardado);
        } catch (error) {
        this.logger.error(`Error generando cuotas para contrato ${contratoGuardado.id}:`, error);
        // No lanzamos error para no revertir la creación del contrato
        }

        // Creacion PDF

        const pdfPath = await this.pdfService.generateContractPDF({
            Id : contratoGuardado.id,
            Inquilino : contratoGuardado.inquilino,
            Propiedad : contratoGuardado.propiedad,
            fecha_inicio : contratoGuardado.fecha_inicio,
            fecha_fin : contratoGuardado.fecha_fin,
            monto_mensual : contratoGuardado.monto_mensual,
            garantia : contratoGuardado.garantia
        });

        contratoGuardado.archivo_pdf = pdfPath;
        await AppDataSource.getRepository(Contrato).save(contratoGuardado);
    
        // Cargar relaciones para la respuesta
        const contratoCompleto = await AppDataSource.getRepository(Contrato).findOne({
            where: { id: contratoGuardado.id },
            relations: [
                'propiedad', 
                'propiedad.propietario',  
                'inquilino'
            ]
        });
    
        ContratoRules.validarContratoCompleto(contratoCompleto!);
    
        return this.toResponseDto(contratoCompleto!);
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

    async FinalizarContrato(contratoId : number){
        // Conseguir Contrato
        
        var contrato = await this.getContratoById(contratoId);
        if (!contrato) {
            throw new BadRequestException(`El contrato con ID ${contratoId} no existe.`);
        }

        // Verificar estado actual
        ContratoRules.validarEstadoContratoNoFinalizado(contrato.estado);
        
        // Calculos descuento
        var ultimoAlquiler = contrato.monto_mensual;
        var nuevaGarantia = contrato.garantia - ultimoAlquiler;
        contrato.garantia = nuevaGarantia;

        //Cargar ultima cuota 
        var ultimaCuota = await this.obtenerUltimaCuotaPendiente(contratoId);

        ContratoRules.validarDescuentoGarantia(nuevaGarantia,ultimaCuota!);


        // Actualizar estado a "finalizado"
        contrato.estado = "finalizado";
        contrato.fecha_fin = new Date(); // Fecha de finalizacion es hoy

        await this.updateContrato(contratoId, contrato);

        const pdfPath = await this.pdfService.generateFinalReceiptPDF({
            contrato: contrato, 
            ultimoAlquiler: ultimoAlquiler, 
            garantiaFinal: nuevaGarantia,
            tiempoContrato: this.CalcularMesesContrato(contrato.fecha_inicio, new Date()),
            Inquilino: contrato.inquilino,
            Propiedad: contrato.propiedad
        });

        return { message: `El contrato con ID ${contratoId} ha sido finalizado. El recibo final fue guardado en ${pdfPath}` };

    }

    private toResponseDto(contrato: Contrato): ResponseContratoDto {
        const response = new ResponseContratoDto();
        
        response.id = contrato.id;
        response.fecha_inicio = contrato.fecha_inicio;
        response.fecha_fin = contrato.fecha_fin;
        response.monto_mensual = contrato.monto_mensual;
        response.garantia = contrato.garantia;
        response.archivo_pdf = contrato.archivo_pdf;
        
        // Propiedad 
        response.propiedad = {
            id: contrato.propiedad.id,
            direccion: contrato.propiedad.direccion,
            tipo: contrato.propiedad.tipo,
            propietario: {
                id: contrato.propiedad.propietario.id,
                nombre: contrato.propiedad.propietario.nombre,
                apellido: contrato.propiedad.propietario.apellido,
                email: contrato.propiedad.propietario.email
            }
        };
        
        // Inquilino 
        response.inquilino = {
            id: contrato.inquilino.id,
            nombre: contrato.inquilino.nombre,
            apellido: contrato.inquilino.apellido,
            email: contrato.inquilino.email
        };
        
        return response;
    }
    
    private async obtenerUltimaCuotaPendiente(contratoId: number) {
        return await AppDataSource.getRepository(Cuota).findOne({
            where: { 
                contrato: { id: contratoId },
                estado: 'pendiente'
            },
            order: { fecha_vencimiento: "DESC" }
        });
    }

    async getContratosPorPropietario(propietarioId: number): Promise<Contrato[]> {
        return AppDataSource.getRepository(Contrato).find({
            where: { 
              propiedad: { 
                propietario: { id: propietarioId } 
              } 
            },
            relations: ["propiedad", "propiedad.propietario", "inquilino"]
          });
        }

}