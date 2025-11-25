import { Body, Controller, Delete, Get, Param, Post, Put, NotFoundException, Res, HttpStatus } from "@nestjs/common";
import { PagoService } from "./pago.service";
import { CreatePagoDto } from "./pagoDto/create-pago.dto";
import { UpdatePagoDto } from "./pagoDto/update-pago.dto";
import { Response } from 'express';

@Controller('pago')
export class PagoController {
    constructor(private readonly pagoService: PagoService) {}
   
    @Post()
    async createPago(@Body() createPagoDto: CreatePagoDto) {
        return this.pagoService.createPago(createPagoDto);
    }

    @Get()
    async getAllPago() {
        return this.pagoService.getAllPago();
    }

    @Get(':id')
    async getPagoById(@Param('id') id: number) {
        return this.pagoService.getPagoById(id);
    }

    @Put(':id')
    async updatePago(@Param('id') id: number, @Body() updatePagoDto: UpdatePagoDto) {
        return this.pagoService.updatePago(id, updatePagoDto);
    }

    @Delete(':id')
    async deletePago(@Param('id') id: number) {
        return this.pagoService.deletePago(id);
    }

    @Get('propietario/:propietarioId')
    async getPagosByPropietario(@Param('propietarioId') propietarioId: number) {
        return this.pagoService.getPagosByPropietario(propietarioId);
    }

    @Get("descargar/:id")
    async descargarPDF(@Param("id") id: number, @Res() res) {
        const pago = await this.pagoService.getPagoById(id);

        if (!pago || !pago.ruta_pdf) {
            throw new NotFoundException("PDF no encontrado.");
        }

        // Configurar headers para descarga
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="recibo-pago-${id}.pdf"`);
        
        return res.download(pago.ruta_pdf);
    }
}