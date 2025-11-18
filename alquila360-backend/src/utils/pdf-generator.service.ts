import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import PDFDocument = require("pdfkit");
import { Propiedad } from "src/entity/propiedad.entity";
import { User } from "src/entity/user.entity";

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
  async generateContractPDF(data: {
        Id : number;
        Inquilino : User;
        Propiedad : Propiedad;
        fecha_inicio : Date;
        fecha_fin : Date;
        monto_mensual : number; 
        garantia : number;
  }): Promise<string> {

    // Ruta del archivo
    const storageDir = path.join(process.cwd(), "storage/contratos");
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    const pdfPath = path.join(storageDir, `contrato-${data.Id}.pdf`);

    // Crear documento PDF
    const doc = new PDFDocument();

    // Guardar PDF en la ruta
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // ------------------------------------
    //  CABECERA
    // ------------------------------------
    doc.fontSize(22).text("CONTRATO", { align: "center" });
    doc.moveDown();

    // ------------------------------------
    //  INFORMACIÓN DEL PAGO
    // ------------------------------------
    doc.fontSize(16).text("Información del Contrato");
    doc.fontSize(12)
      .text(`Fecha Inicio: ${data.fecha_inicio}`)
      .text(`Fecha Fin: ${data.fecha_fin}`)
      .text(`Monto Mensual: Bs. ${data.monto_mensual}`)
      .text(`Garantía: Bs. ${data.garantia}`)
      .moveDown();
    doc.moveDown();

    // ------------------------------------
    //  PROPIEDAD
    // ------------------------------------
    doc.fontSize(16).text("Propiedad");
    doc.fontSize(12)
      .text(`Descripción: ${data.Propiedad.descripcion}`)
      .text(`Dirección: ${data.Propiedad.direccion}`)
      .text(`Dueño: ${data.Propiedad.propietario?.nombre ?? 'No especificado'} ${data.Propiedad.propietario?.apellido ?? ''}`);
    doc.moveDown();

    // ------------------------------------
    //  INQUILINO
    // ------------------------------------
    doc.fontSize(16).text("Postulante a Inquilino");
    doc.fontSize(12)
      .text(`Nombre: ${data.Inquilino.nombre} ${data.Inquilino.apellido}`)
      .text(`Email: ${data.Inquilino.email}`)
    doc.moveDown();

    // ------------------------------------
    //  Clausalas contrato
    // ------------------------------------
    doc.fontSize(16).text("Cláusulas del Contrato");
    doc.fontSize(12)
      .text("1. El inquilino se compromete a pagar el monto mensual acordado en la fecha establecida.")
      .text("2. El propietario se compromete a mantener la propiedad en condiciones habitables.")
      .text("3. Cualquier daño a la propiedad será responsabilidad del inquilino, salvo desgaste por uso normal.")
      .text("4. El contrato podrá ser renovado previo acuerdo entre ambas partes.")
      .text("5. Cualquier disputa será resuelta conforme a las leyes vigentes.");
    doc.moveDown();

    // ------------------------------------
    //  PIE DE PÁGINA
    // ------------------------------------
    doc.text("------------------------------------------------\n\Firma Inquilino", {
      align: "center"
    });
    doc.moveDown();
    doc.text("------------------------------------------------\n\Firma Propietario", {
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
