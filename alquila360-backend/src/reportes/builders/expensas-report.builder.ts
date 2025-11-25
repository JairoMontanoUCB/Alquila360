import PDFDocument from 'pdfkit';

export class ExpensasReportBuilder {
  build(expensas: any[], contrato: any) {
    const doc = new PDFDocument({ margin: 40 });

    // ENCABEZADO
    doc.fontSize(20).text('Reporte de Expensas', { align: 'center' });
    doc.moveDown();

    // DATOS DEL CONTRATO
    doc.fontSize(12).text(`Contrato ID: ${contrato.id}`);
    doc.text(`Propiedad: ${contrato.propiedad.direccion}`);
    doc.moveDown();

    // LISTA DE EXPENSAS
    expensas.forEach((exp) => {
      doc.text(`Referencia: ${exp.numero_referencia}`);
      doc.text(`Monto: Bs ${exp.monto}`);
      doc.text(`Vencimiento: ${exp.fecha_vencimiento}`);
      doc.text(`Estado: ${exp.estado}`);
      doc.moveDown();
    });

    doc.end();
    return doc; // <<< STREAM, NO BUFFER
  }
}
