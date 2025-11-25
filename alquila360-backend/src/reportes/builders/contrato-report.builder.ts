import PDFDocument from 'pdfkit';

export class ContratoReportBuilder {
  build(contrato: any) {
    const doc = new PDFDocument({ margin: 40 });

    doc.fontSize(20).text('Reporte de Contrato', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text('Datos del Contrato', { underline: true });
    doc.fontSize(12)
      .text(`Contrato ID: ${contrato.id}`)
      .text(`Fecha inicio: ${contrato.fecha_inicio}`)
      .text(`Fecha fin: ${contrato.fecha_fin}`)
      .text(`Monto mensual: Bs ${contrato.monto_mensual}`)
      .text(`Garantía: Bs ${contrato.garantia}`)
      .moveDown();

    doc.fontSize(14).text('Inquilino', { underline: true });
    doc.fontSize(12)
      .text(`${contrato.inquilino.nombre} ${contrato.inquilino.apellido}`)
      .text(`Email: ${contrato.inquilino.email}`)
      .moveDown();

    doc.fontSize(14).text('Propiedad', { underline: true });
    doc.fontSize(12)
      .text(`Dirección: ${contrato.propiedad.direccion}`)
      .text(`Tipo: ${contrato.propiedad.tipo}`)
      .text(`Propietario: ${contrato.propiedad.propietario.nombre} ${contrato.propiedad.propietario.apellido}`)
      .moveDown();

    doc.end();
    return doc; // STREAM
  }
}
