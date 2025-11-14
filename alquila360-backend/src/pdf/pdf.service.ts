import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class PdfService {

  async generarReciboPago(data: any) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();

    // Plantilla HTML dinámica
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #0070f3; }
            table { width: 100%; margin-top: 20px; border-collapse: collapse; }
            td, th { border: 1px solid #ddd; padding: 8px; }
            .header { margin-bottom: 30px; }
          </style>
        </head>

        <body>
          <div class="header">
            <h1>Recibo de Pago</h1>
            <p><strong>Cliente:</strong> ${data.clienteNombre}</p>
            <p><strong>CI:</strong> ${data.clienteCi}</p>
          </div>

          <table>
            <tr>
              <th>Concepto</th>
              <th>Monto</th>
            </tr>
            <tr>
              <td>${data.descripcion}</td>
              <td>${data.monto} Bs</td>
            </tr>
          </table>

          <p style="margin-top: 40px;">
            <strong>Fecha:</strong> ${new Date().toLocaleDateString()}
          </p>
        </body>
      </html>
    `;

    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });

    const buffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
    return buffer;
  }
}
