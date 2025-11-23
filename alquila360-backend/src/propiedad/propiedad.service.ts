import { Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Propiedad } from "src/entity/propiedad.entity";
import { PropiedadFoto } from "src/entity/propiedad_foto.entity";
import { CreatePropiedadDto } from "./propiedadDto/create-propiedad.dto";
import { User } from "src/entity/user.entity";
import { BusinessException } from "src/common/Exceptions/BussinessException";
import { PropiedadRules } from "src/common/Rules/PropiedadRules";

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


    async getAllPropiedad() {
        return await AppDataSource.getRepository(Propiedad).find({
            relations: ["fotos", "propietario"]
        });
    }

    async getPropiedadById(id: number) {
        return await AppDataSource.getRepository(Propiedad).findOne({
            where: { id },
            relations: ["fotos", "propietario"]
        });
    }

    async updatePropiedad(id: number, propiedadData: Partial<Propiedad>) {
        await AppDataSource.getRepository(Propiedad).update(id, propiedadData);
        return this.getPropiedadById(id);
    }

    async deletePropiedad(id: number) {
        return await AppDataSource.getRepository(Propiedad).delete(id);
    }

}
