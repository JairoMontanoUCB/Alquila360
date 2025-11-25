import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { PropiedadService } from './propiedad.service';
import { CreatePropiedadDto } from './propiedadDto/create-propiedad.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import { RatePropiedadDto } from './propiedadDto/rate-propiedad.dto';

@Controller('/propiedad')
export class PropiedadController {
  constructor(private readonly propiedadService: PropiedadService) {}

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
    @Body() dto: CreatePropiedadDto,
    @UploadedFiles() fotos: Express.Multer.File[],
  ) {
    return this.propiedadService.createPropiedad(dto, fotos);
  }

  @Get()
  getAll() {
    return this.propiedadService.getAllPropiedad();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.propiedadService.getPropiedadById(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    return this.propiedadService.updatePropiedad(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.propiedadService.deletePropiedad(id);
  }

  @Post(':id/calificar')
  calificarPropiedad(
    @Param('id') propiedadId: number,
    @Body() dto: RatePropiedadDto
  ) {
    return this.propiedadService.calificarPropiedad(propiedadId, dto);
  }

  @Get('disponibles/contratos')
    async getPropiedadesDisponiblesParaContratos() {
      return this.propiedadService.getPropiedadesDisponiblesParaContratos();     
  }
  @Post(':id/fotos')
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
  subirFotosPropiedad(
    @Param('id') id: number,
    @UploadedFiles() fotos: Express.Multer.File[],
  ) {
    return this.propiedadService.subirFotosPropiedad(id, fotos);
  }

  @Delete(':id/fotos/:fotoId')
  eliminarFotoPropiedad(
    @Param('id') id: number,
    @Param('fotoId') fotoId: number,
  ) {
    return this.propiedadService.eliminarFotoPropiedad(id, fotoId);
  }

  @Get('propietario/:propietarioId')
  async getPropiedadesPorPropietario(@Param('propietarioId') propietarioId: number) {
    return this.propiedadService.getPropiedadesPorPropietario(propietarioId);
  }
}
