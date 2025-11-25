import { Controller, Get, Param, Res } from '@nestjs/common';
import { ReportesService } from './reportes.service';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

@Get('pagos/:contratoId')
async generarPagos(@Param('contratoId') contratoId: number, @Res() res) {
  const stream = await this.reportesService.reportePagos(contratoId);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="reporte-pagos.pdf"',
  });

  stream.pipe(res);
}

  @Get('expensas/:contratoId')
async generarExpensas(@Param('contratoId') contratoId: number, @Res() res) {
  const stream = await this.reportesService.reporteExpensas(contratoId);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="reporte-expensas.pdf"',
  });

  stream.pipe(res);
}
 @Get('contrato/:contratoId')
async generarContrato(@Param('contratoId') contratoId: number, @Res() res) {
  const stream = await this.reportesService.reporteContrato(contratoId);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="reporte-contrato.pdf"',
  });

  stream.pipe(res);
}


  @Get('mantenimiento/:propiedadId')
async generarMantenimiento(@Param('propiedadId') propiedadId: number, @Res() res) {
  const stream = await this.reportesService.reporteMantenimiento(propiedadId);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'inline; filename="reporte-mantenimiento.pdf"',
  });

  stream.pipe(res);
}

}
