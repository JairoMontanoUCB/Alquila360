import { Body, Controller, Delete, Get, Param, Post, Put,Res, NotFoundException } from "@nestjs/common";
import { ContratoService } from "./contrato.service";
import { Contrato } from "src/entity/contrato.entity";
import { CreateContratoDto } from "src/contrato/contratoDto/create-contrato.dto";
import { get } from "http";

import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';


@Controller('/contrato')
export class ContratoController {
    constructor(private readonly contratoService : ContratoService) {}

    @Post("registrar")
    RegistrarUsuarioContrato(@Body() contratoDto: CreateContratoDto) {
        return this.contratoService.RegistrarUsuarioContrato(contratoDto);
    }

    @Get()
    getAllContrato() {
        return this.contratoService.getAllContrato();
    }

    @Get(':id/pdf')
downloadContratoPDF(@Param('id') id: number, @Res() res: Response) {
  const pdfPath = path.join(process.cwd(), 'storage/contratos', `contrato-${id}.pdf`);

  // Verificar que exista
  if (!fs.existsSync(pdfPath)) {
    throw new NotFoundException('El PDF del contrato no existe');
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=contrato-${id}.pdf`);

  const fileStream = fs.createReadStream(pdfPath);
  fileStream.pipe(res);
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

    @Get("/actual/:usuarioId")
getContratoActivo(@Param("usuarioId") usuarioId: number) {
  return this.contratoService.getContratoActivo(usuarioId);
}

@Get('/inquilino/:id')
async getContratoPorInquilino(@Param('id') id: number) {
  return this.contratoService.getContratoPorInquilino(id);
}






}


