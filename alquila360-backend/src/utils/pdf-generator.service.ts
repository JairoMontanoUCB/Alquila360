import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import puppeteer from "puppeteer";

@Injectable()
export class PdfGeneratorService {

    async generatePaymentPDF(data: {
        id: number;
        fecha: Date;
        monto: number;
        propiedad: any;
        contrato: any;
    }): Promise<string> {

        const html = this.buildHTML(data);

        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox"],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "domcontentloaded" });

        // ruta carpeta
        const storageDir = path.join(process.cwd(), "storage/recibos");
        if (!fs.existsSync(storageDir)) {
            fs.mkdirSync(storageDir, { recursive: true });
        }

        const pdfPath = path.join(storageDir, `pago-${data.id}.pdf`);

        // generar pdf
        await page.pdf({
            path: pdfPath,
            format: "A4",
            printBackground: true,
        });

        await browser.close();

        return pdfPath;
    }

    /** -------------------------------
     *  PLANTILLA HTML COMPLETA
     *  ------------------------------- */
    private buildHTML(data: any): string {
        return `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; padding: 25px; background: #f6f6f6; }
                .container { background: #fff; padding: 20px; border-radius: 8px; }
                h1 { text-align: center; margin-bottom: 30px; }
                .section { margin-bottom: 20px; }
                .section-title { font-size: 18px; margin-bottom: 10px; font-weight: bold; }
                .info { padding: 10px; border: 1px solid #333; border-radius: 6px; }
                .label { font-weight: bold; }
                footer { text-align: center; margin-top: 40px; font-size: 13px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>RECIBO DE PAGO</h1>

                <div class="section">
                    <div class="section-title">Información del Pago</div>
                    <div class="info">
                        <p><span class="label">Comprobante Nº:</span> ${data.id}</p>
                        <p><span class="label">Fecha:</span> ${data.fecha}</p>
                        <p><span class="label">Monto:</span> Bs. ${data.monto}</p>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Propiedad</div>
                    <div class="info">
                        <p><span class="label">Descripcion:</span> ${data.propiedad?.descripcion ?? "N/A"}</p>
                        <p><span class="label">Dirección:</span> ${data.propiedad?.direccion ?? "N/A"}</p>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Contrato</div>
                    <div class="info">
                        <p><span class="label">Contrato Nº:</span> ${data.contrato?.id ?? "N/A"}</p>
                        <p><span class="label">Fecha Inicio:</span> ${data.contrato?.fecha_inicio ?? "N/A"}</p>
                        <p><span class="label">Fecha Fin:</span> ${data.contrato?.fecha_fin ?? "N/A"}</p>
                    </div>
                </div>

                <footer>
                    Recibo generado automáticamente por el sistema Alquila360.
                </footer>
            </div>
        </body>
        </html>
        `;
    }
}