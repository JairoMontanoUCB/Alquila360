import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import PDFDocument = require("pdfkit");

@Injectable()
export class PdfKitGeneratorService {

  async generatePaymentPDF(data: {
    id: number;
    fecha: Date;
    monto: number;
    propiedad: any;
    contrato: any;
  }): Promise<string> {

    // Ruta del archivo
    const storageDir = path.join(process.cwd(), "storage/recibos");
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const pdfPath = path.join(storageDir, `pago-${data.id}.pdf`);

    // Crear documento PDF
    const doc = new PDFDocument();

    // Guardar PDF en la ruta
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // ------------------------------------
    //  CABECERA
    // ------------------------------------
    doc.fontSize(22).text("RECIBO DE PAGO", { align: "center" });
    doc.moveDown();

    // ------------------------------------
    //  INFORMACIÓN DEL PAGO
    // ------------------------------------
    doc.fontSize(16).text("Información del Pago");
    doc.fontSize(12)
      .text(`Comprobante Nº: ${data.id}`)
      .text(`Fecha: ${data.fecha}`)
      .text(`Monto: Bs. ${data.monto}`);
    doc.moveDown();

    // ------------------------------------
    //  PROPIEDAD
    // ------------------------------------
    doc.fontSize(16).text("Propiedad");
    doc.fontSize(12)
      .text(`Descripción: ${data.propiedad?.descripcion ?? "N/A"}`)
      .text(`Dirección: ${data.propiedad?.direccion ?? "N/A"}`);
    doc.moveDown();

    // ------------------------------------
    //  CONTRATO
    // ------------------------------------
    doc.fontSize(16).text("Contrato");
    doc.fontSize(12)
      .text(`Contrato Nº: ${data.contrato?.id ?? "N/A"}`)
      .text(`Fecha Inicio: ${data.contrato?.fecha_inicio}`)
      .text(`Fecha Fin: ${data.contrato?.fecha_fin}`);
    doc.moveDown();

    // ------------------------------------
    //  PIE DE PÁGINA
    // ------------------------------------
    doc.text("\n\nRecibo generado automáticamente por el sistema Alquila360.", {
      align: "center"
    });

    // Cerrar PDF
    doc.end();

    return new Promise((resolve, reject) => {
      writeStream.on("finish", () => resolve(pdfPath));
      writeStream.on("error", reject);
    });
  }

}
