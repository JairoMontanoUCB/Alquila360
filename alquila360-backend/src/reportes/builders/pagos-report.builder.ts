import PDFDocument from 'pdfkit';

export class PagosReportBuilder {
  build(pagos: any[]) {
    const doc = new PDFDocument({ margin: 40 });

    doc.fontSize(20).text('Reporte de Pagos', { align: 'center' });
    doc.moveDown();

    pagos.forEach((pago) => {
      doc.fontSize(12)
        .text(`Fecha pago: ${pago.fecha_pago}`)
        .text(`Monto: Bs ${pago.monto}`)
        .text(`Medio: ${pago.medio_pago}`)
        .text(`Referencia cuota: ${pago.cuota.numero_referencia}`)
        .moveDown();
    });

    doc.end();
    return doc;  // <<< devolver stream, NO buffer
  }
}
