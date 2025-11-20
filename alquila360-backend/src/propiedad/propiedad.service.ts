import { Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Propiedad } from "src/entity/propiedad.entity";
import { PropiedadFoto } from "src/entity/propiedad_foto.entity";

@Injectable()
export class PropiedadService {

  async crearPropiedad(data: any, fotos: Express.Multer.File[]) {
    const repoProp = AppDataSource.getRepository(Propiedad);

    // Crear objeto propiedad
    const propiedad = repoProp.create({
      direccion: data.direccion,
      ciudad: data.ciudad,
      tipo: data.tipo,
      estado: "disponible",
      descripcion: data.descripcion ?? null,
      precio_referencia: data.precio_referencia,
      propietario: { id: data.propietarioId }
    });

    // Guardar propiedad en DB
    await repoProp.save(propiedad);

    // Guardar fotos si vienen
    if (fotos && fotos.length > 0) {
      const repoFoto = AppDataSource.getRepository(PropiedadFoto);

      for (const foto of fotos) {
        const nuevaFoto = repoFoto.create({
          ruta: `/storage/propiedades/${foto.filename}`,
          propiedad: propiedad
        });

        await repoFoto.save(nuevaFoto);
      }
    }

    return {
      message: "Propiedad creada correctamente",
      id: propiedad.id
    };
  }

  async getAllPropiedad() {
    return AppDataSource.getRepository(Propiedad).find({
      relations: ["fotos", "propietario"]
    });
  }

  async getPropiedadById(id: number) {
    return AppDataSource.getRepository(Propiedad).findOne({
      where: { id },
      relations: ["fotos", "propietario"]
    });
  }

  async updatePropiedad(id: number, propiedadData: Partial<Propiedad>) {
    await AppDataSource.getRepository(Propiedad).update(id, propiedadData);
    return this.getPropiedadById(id);
  }

  async deletePropiedad(id: number) {
    return AppDataSource.getRepository(Propiedad).delete(id);
  }
}
