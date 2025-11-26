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

    @Get("/actual/:usuarioId")
getContratoActivo(@Param("usuarioId") usuarioId: number) {
  return this.contratoService.getContratoActivo(usuarioId);
}




}


