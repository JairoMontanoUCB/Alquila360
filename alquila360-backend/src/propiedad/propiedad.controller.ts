import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards
} from '@nestjs/common';

import { PropiedadService } from './propiedad.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Controller('propiedad')
export class PropiedadController {
  constructor(private readonly propiedadService: PropiedadService) {}

  @UseGuards(JwtAuthGuard)
  @Post('crear')
  @UseInterceptors(
    FilesInterceptor('fotos', 10, {
      storage: diskStorage({
        destination: './storage/propiedades',
        filename: (req, file, cb) => {
          const name = uuid() + path.extname(file.originalname);
          cb(null, name);
        },
      }),
    }),
  )
  crearPropiedad(
    @Body() body: any,
    @UploadedFiles() fotos: Express.Multer.File[],
  ) {
    return this.propiedadService.crearPropiedad(body, fotos);
  }

  @Get()
  getAll() {
    return this.propiedadService.getAllPropiedad();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.propiedadService.getPropiedadById(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.propiedadService.deletePropiedad(id);
  }
}
