import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { PagoService } from "./pago.service";
import { Pago } from "src/entity/pago.entity";
import { get } from "http";

@Controller('/pago')
export class PagoController {
    constructor(private readonly pagoService : PagoService) {


    }
    
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
}


