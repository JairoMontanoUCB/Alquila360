import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ContratoService } from "./contrato.service";
import { Contrato } from "src/entity/contrato.entity";
import { CreateContratoDto } from "src/contrato/contratoDto/create-contrato.dto";
import { get } from "http";

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
}


