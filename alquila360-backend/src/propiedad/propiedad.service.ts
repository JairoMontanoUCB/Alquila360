import { Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Propiedad } from "src/entity/propiedad.entity";
import { PropiedadFoto } from "src/entity/propiedad_foto.entity";
import { CreatePropiedadDto } from "./propiedadDto/create-propiedad.dto";
import { User } from "src/entity/user.entity";
import { RatePropiedadDto } from "./propiedadDto/rate-propiedad.dto";
import { PropertyRating } from "src/entity/property_rating.entity"; // ✅ IMPORTANTE
import { Contrato } from "src/entity/contrato.entity";


@Injectable()
export class PropiedadService {

  async createPropiedad(propiedadDto: CreatePropiedadDto, fotos: Express.Multer.File[]) {

    const propiedadRepo = AppDataSource.getRepository(Propiedad);
    const fotoRepo = AppDataSource.getRepository(PropiedadFoto);

    // Crear propiedad
    const propiedad = propiedadRepo.create({
      direccion: propiedadDto.direccion,
      ciudad: propiedadDto.ciudad,
      tipo: propiedadDto.tipo,
      estado: "disponible",
      descripcion: propiedadDto.descripcion ?? null,
      precio_referencia: propiedadDto.precio_referencia,
      propietario: { id: propiedadDto.propietarioId }
    });

    await propiedadRepo.save(propiedad);

    // Guardar fotos
    if (fotos && fotos.length > 0) {
      for (const foto of fotos) {
        const nuevaFoto = fotoRepo.create({
          ruta_foto: `/storage/propiedades/${foto.filename}`,
          propiedad: propiedad
        });

        await fotoRepo.save(nuevaFoto);
      }
    }

    return {
      message: 'Propiedad creada correctamente',
      id: propiedad.id,
    };
  }

  async calificarPropiedad(propiedadId: number, dto: RatePropiedadDto) {

    const propiedadRepo = AppDataSource.getRepository(Propiedad);
    const ratingRepo = AppDataSource.getRepository(PropertyRating);
    const userRepo = AppDataSource.getRepository(User);

    const propiedad = await propiedadRepo.findOne({ where: { id: propiedadId } });
    if (!propiedad) throw new Error("La propiedad no existe");

    const autor = await userRepo.findOne({ where: { id: dto.autorId } });
    if (!autor) throw new Error("El autor no existe");

    const nuevaCalificacion = ratingRepo.create({
      estrellas: dto.estrellas,
      comentario: dto.comentario || null,
      propiedad,
      autor
    });

    await ratingRepo.save(nuevaCalificacion);

    // ACTUALIZAR PROMEDIO
    propiedad.ratingTotal += dto.estrellas;
    propiedad.ratingCount += 1;
    propiedad.ratingPromedio = propiedad.ratingTotal / propiedad.ratingCount;

    await propiedadRepo.save(propiedad);

    return {
      message: "Calificación registrada",
      ratingPromedio: propiedad.ratingPromedio,
      ratingCount: propiedad.ratingCount
    };
  }

  async getAllPropiedad() {
    return AppDataSource.getRepository(Propiedad).find({
      relations: ["fotos", "propietario", "calificaciones"]
    });
  }

  async getPropiedadById(id: number) {
    return AppDataSource.getRepository(Propiedad).findOne({
      where: { id },
      relations: ["fotos", "propietario", "calificaciones"]
    });
  }

  async updatePropiedad(id: number, propiedadData: Partial<Propiedad>) {
    await AppDataSource.getRepository(Propiedad).update(id, propiedadData);
    return this.getPropiedadById(id);
  }

  async deletePropiedad(id: number) {
    return AppDataSource.getRepository(Propiedad).delete(id);
  }

  async getPropiedadesDisponiblesParaContratos() {
    return AppDataSource.getRepository(Propiedad).find({
      where: { estado: "disponible" },
      relations: ["fotos", "propietario", "calificaciones"]
    });
  }

  async subirFotosPropiedad(id: number, fotos: Express.Multer.File[]) {
    const propiedadRepo = AppDataSource.getRepository(Propiedad);
    const fotoRepo = AppDataSource.getRepository(PropiedadFoto);

    // Verificar que la propiedad existe
    const propiedad = await propiedadRepo.findOne({ 
      where: { id },
      relations: ["fotos"]
    });

    if (!propiedad) {
      throw new Error("La propiedad no existe");
    }

    // Guardar nuevas fotos
    if (fotos && fotos.length > 0) {
      for (const foto of fotos) {
        const nuevaFoto = fotoRepo.create({
          ruta_foto: `/storage/propiedades/${foto.filename}`,
          propiedad: propiedad
        });

        await fotoRepo.save(nuevaFoto);
      }
    }

    // Devolver la propiedad actualizada con las fotos
    return this.getPropiedadById(id);
  }

  async eliminarFotoPropiedad(id: number, fotoId: number) {
    const fotoRepo = AppDataSource.getRepository(PropiedadFoto);
    
    // Buscar la foto y verificar que pertenece a la propiedad
    const foto = await fotoRepo.findOne({
      where: { 
        id: fotoId,
        propiedad: { id } 
      }
    });

    if (!foto) {
      throw new Error("Foto no encontrada o no pertenece a esta propiedad");
    }

    // Eliminar archivo físico del sistema de archivos
    const fs = require('fs');
    const path = require('path');
    
    // Construir la ruta completa del archivo
    const filePath = path.join(process.cwd(), foto.ruta_foto);
    
    try {
      // Verificar si el archivo existe y eliminarlo
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
      }
    } catch (error) {

    }

    // Eliminar el registro de la base de datos
    await fotoRepo.remove(foto);

    return { message: "Foto eliminada correctamente" };
  }

  async getPropiedadesPorPropietario(propietarioId: number) {
    return AppDataSource.getRepository(Propiedad).find({
      where: { propietario: { id: propietarioId } },
      relations: ["fotos", "propietario", "calificaciones"]
    });
  }
  

  async getPropiedadesPorInquilino(usuarioId: number) {
  const contratos = await AppDataSource.getRepository(Contrato).find({
    where: { inquilino: { id: usuarioId } },
    relations: ["propiedad"],
  });

  return contratos.map(c => c.propiedad);
}
async getByInquilino(id: number) {
  return AppDataSource.getRepository(Propiedad).find({
    where: { contratos: { inquilino: { id } } },
    relations: ["contratos"]
  });
}





}
