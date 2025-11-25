import { Body, Controller, Delete, Get, Param, Post, Res, NotFoundException } from "@nestjs/common";
import type { Response } from 'express';
import { join } from 'path';
import { ContratoService } from "./contrato.service";
import { Contrato } from "src/entity/contrato.entity";
import { CreateContratoDto } from "src/contrato/contratoDto/create-contrato.dto";
import { get } from "http";
import { BusinessException } from "src/common/Exceptions/BussinessException";
import { existsSync } from "node:fs";
import AppDataSource from "src/data-source";

@Controller('/contrato')
export class ContratoController {
    constructor(private readonly contratoService : ContratoService) {}

    @Post("/registrar")
    RegistrarUsuarioContrato(@Body() contratoDto: CreateContratoDto) {
        return this.contratoService.RegistrarUsuarioContrato(contratoDto);
    }

    @Get()
    getAllContrato() {
        return this.contratoService.getAllContrato();
    }

    @Get('/:id')
    getContratoById(@Param('id') id: number) {
        return this.contratoService.getContratoById(id);
    }
    
    @Delete('/:id')
    deleteContrato(@Param('id') id: number) {
        return this.contratoService.deleteContrato(id);
    }

    @Get('/TerminarContrato/:id')
    TerminarContrato(@Param('id') id: number) {
        return this.contratoService.FinalizarContrato(id);
    }

    @Get('propietario/:propietarioId')
        async getContratosPorPropietario(@Param('propietarioId') propietarioId: number) {
        return this.contratoService.getContratosPorPropietario(propietarioId);
    }

    @Get(':id/pdf')
    async descargarContratoPDF(@Param('id') id: number, @Res() res: Response) {
        try {
            const contrato = await this.contratoService.getContratoById(id);
            
            if (!contrato || !contrato.archivo_pdf) {
            throw new BusinessException('PDF no encontrado');
            }
            
            // USAR LA RUTA COMPLETA DIRECTAMENTE
            const filePath = contrato.archivo_pdf;
            
            if (!existsSync(filePath)) {
            throw new BusinessException('Archivo PDF no encontrado');
            }
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=contrato-${id}.pdf`);
            
            return res.sendFile(filePath);
        } catch (error) {
            throw error;
        }
    }
}


