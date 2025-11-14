import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { PagoService } from '../pago/pago.service'; 
import { UserService } from '../user/user.service';

@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly pagoService: PagoService,
    private readonly userService: UserService
  ) {}

  
}
