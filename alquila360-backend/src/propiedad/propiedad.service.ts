import { Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Propiedad } from "src/entity/propiedad.entity";
import { PropiedadFoto } from "src/entity/propiedad_foto.entity";

@Injectable()
export class PropiedadService {

    async createPropiedad(data: any) {

        
        const propiedad = await AppDataSource.getRepository(Propiedad).save({
            direccion: data.direccion,
            ciudad: data.ciudad,
            tipo: data.tipo,
            estado: data.estado,
            descripcion: data.descripcion,
            precio_referencia: data.precio_referencia,
            propietario: { id: data.propietarioId }
        });

        
        if (data.fotos && data.fotos.length > 0) {

            const fotoRepo = AppDataSource.getRepository(PropiedadFoto);

            const fotosAInsertar = data.fotos.map((ruta: string) => ({
                ruta_foto: ruta,
                propiedad: propiedad  
            }));

            await fotoRepo.save(fotosAInsertar);
        }

        return propiedad;
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
