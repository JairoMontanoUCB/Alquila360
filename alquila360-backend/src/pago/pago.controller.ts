import { Body, Controller, Delete, Get, Param, Post, Put, NotFoundException, Res } from "@nestjs/common";
import { PagoService } from "./pago.service";
import { Pago } from "src/entity/pago.entity";
import { get } from "http";
import * as fs from "fs";

@Controller('/pago')
export class PagoController {
    constructor(private readonly pagoService : PagoService) {}
    
    @Post()
    createPago(@Body() pago : Pago) {
        return this.pagoService.createPago(pago);
    }

    @Get()
    getAllPago() {
        return this.pagoService.getAllPago();
    }
    @Get('/:id')
    getPagoById(@Param()param: any) {
        return this.pagoService.getPagoById(param.id);
    }
    @Put('/:id')
    updatePago(@Param()param: any, @Body() pago: Pago) {
        return this.pagoService.updatePago(param.id, pago);
    }
    @Delete('/:id')
    deletePago(@Param()param: any) {
        return this.pagoService.deletePago(param.id);
    }

    @Get("descargar/:id")
    async descargarPDF(@Param("id") id: number, @Res() res) {
        const pago = await this.pagoService.getPagoById(id);

        if (!pago || !pago.ruta_pdf) {
            throw new NotFoundException("PDF no encontrado.");
        }

        if (!fs.existsSync(pago.ruta_pdf)) {
            throw new NotFoundException("El archivo PDF no existe en el servidor.");
        }

        res.download(pago.ruta_pdf);
    }
}


