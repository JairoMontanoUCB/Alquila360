import { PdfKitGeneratorService } from "./pdf-generator.service";
import { Module } from '@nestjs/common';


@Module({
  providers: [PdfKitGeneratorService],
  exports: [PdfKitGeneratorService],   
})
export class PdfModule {}
