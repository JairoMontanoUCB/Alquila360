import PDFDocument from 'pdfkit';
import * as fs from 'fs';

export class MantenimientoReportBuilder {
  build(propiedad: any, tickets: any[]) {
    const doc = new PDFDocument({ margin: 40 });

    // Encabezado
    doc.fontSize(20).text('Reporte de Tickets de Mantenimiento', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12)
      .text(`Propiedad ID: ${propiedad.id}`)
      .text(`Dirección: ${propiedad.direccion}`)
      .text(`Tipo: ${propiedad.tipo}`)
      .moveDown();

    tickets.forEach(ticket => {
      doc.fontSize(14).text(`Ticket #${ticket.id}`, { underline: true });
      doc.fontSize(12)
        .text(`Descripción: ${ticket.descripcion}`)
        .text(`Prioridad: ${ticket.prioridad}`)
        .text(`Estado: ${ticket.estado}`)
        .text(`Inquilino: ${ticket.usuario?.nombre} ${ticket.usuario?.apellido}`)
        .text(`Técnico: ${ticket.tecnico ? `${ticket.tecnico.nombre} ${ticket.tecnico.apellido}` : 'No asignado'}`)
        .moveDown();

      if (ticket.fotos?.length > 0) {
        doc.text('Fotos:', { underline: true });

        ticket.fotos.forEach(f => {
          const absolutePath = `${process.cwd()}${f.ruta}`;
          
          if (fs.existsSync(absolutePath)) {
            try {
              doc.image(absolutePath, { width: 150 }).moveDown();
            } catch (err) {
              doc.text(`(No se pudo cargar imagen ${absolutePath})`);
            }
          } else {
            doc.text(`Imagen no encontrada: ${absolutePath}`);
          }
        });

        doc.moveDown();
      }

      doc.moveDown();
    });

    doc.end();
    return doc;
  }
}
