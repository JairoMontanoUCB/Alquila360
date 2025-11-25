import { Module } from '@nestjs/common';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';

import { PagosReportBuilder } from './builders/pagos-report.builder';
import { ExpensasReportBuilder } from './builders/expensas-report.builder';
import { ContratoReportBuilder } from './builders/contrato-report.builder';
import { MantenimientoReportBuilder } from './builders/mantenimiento-report.builder';

@Module({
  controllers: [ReportesController],
  providers: [
    ReportesService,
    PagosReportBuilder,
    ExpensasReportBuilder,
    ContratoReportBuilder,
    MantenimientoReportBuilder,
  ],
})
export class ReportesModule {}
