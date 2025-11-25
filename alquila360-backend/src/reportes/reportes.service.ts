import { Injectable } from '@nestjs/common';
import AppDataSource from 'src/data-source';
import { Pago } from 'src/entity/pago.entity';
import { Cuota } from 'src/entity/cuota.entity';
import { Contrato } from 'src/entity/contrato.entity';
import { Propiedad } from 'src/entity/propiedad.entity';
import { Ticket } from 'src/entity/ticket.entity';

import { PagosReportBuilder } from './builders/pagos-report.builder';
import { ExpensasReportBuilder } from './builders/expensas-report.builder';
import { ContratoReportBuilder } from './builders/contrato-report.builder';
import { MantenimientoReportBuilder } from './builders/mantenimiento-report.builder';

@Injectable()
export class ReportesService {
  constructor(
    private readonly pagosBuilder: PagosReportBuilder,
    private readonly expensasBuilder: ExpensasReportBuilder,
    private readonly contratoBuilder: ContratoReportBuilder,
    private readonly mantenimientoBuilder: MantenimientoReportBuilder,
  ) {}

  // PAGOS
  async reportePagos(contratoId: number) {
  const pagos = await AppDataSource.getRepository(Pago).find({
    where: { id_contrato: contratoId },
    relations: ['contrato', 'inquilino', 'cuota'],
  });

  return this.pagosBuilder.build(pagos); // devuelve el PDFDocument
}
  // EXPENSAS
  async reporteExpensas(contratoId: number) {
  const expensas = await AppDataSource.getRepository(Cuota).find({
    where: { contrato_id: contratoId, tipo: 'EXPENSA' },
    order: { fecha_vencimiento: 'ASC' },
  });

  const contrato = await AppDataSource.getRepository(Contrato).findOne({
    where: { id: contratoId },
    relations: ['propiedad'],
  });

  if (!contrato) throw new Error('Contrato no encontrado');

  return this.expensasBuilder.build(expensas, contrato);  // <<< STREAM
}

  // CONTRATO COMPLETO
  async reporteContrato(contratoId: number) {
  const contrato = await AppDataSource.getRepository(Contrato).findOne({
    where: { id: contratoId },
    relations: ['inquilino', 'propiedad', 'propiedad.propietario'],
  });

  if (!contrato) {
    throw new Error('Contrato no encontrado');
  }

  return this.contratoBuilder.build(contrato); // STREAM
}

  // TICKETS DE MANTENIMIENTO
  async reporteMantenimiento(propiedadId: number) {
  const propiedad = await AppDataSource.getRepository(Propiedad).findOneBy({ id: propiedadId });

  const tickets = await AppDataSource.getRepository(Ticket).find({
    where: { propiedad: { id: propiedadId } },
    relations: ['usuario', 'tecnico', 'fotos'],
    order: { id: 'ASC' }
  });

  return this.mantenimientoBuilder.build(propiedad, tickets); // <--- PDFDocument
}
}
