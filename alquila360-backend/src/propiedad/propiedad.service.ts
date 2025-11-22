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

    async createPropiedad(propiedadDto: CreatePropiedadDto) {
        var propietario = await AppDataSource.getRepository(User).findOneBy({ 
            id: propiedadDto.propietarioId 
        });

        // validar propietario
        PropiedadRules.ValidarPropietario(propietario!);

        if(propietario?.rol == 'inquilino'){
            propietario.rol = 'propietario';

            await AppDataSource.getRepository(User).save(propietario);
        }

        PropiedadRules.ValidarDatosContrato(propiedadDto);
        
        // Crea propiedad
        const propiedad = await AppDataSource.getRepository(Propiedad).save({
            direccion: propiedadDto.direccion,
            ciudad: propiedadDto.ciudad,
            tipo: propiedadDto.tipo,
            estado: 'disponible', 
            descripcion: propiedadDto.descripcion,
            precio_referencia: propiedadDto.precio_referencia,
            propietario: { id: propiedadDto.propietarioId }
        });
    
        // Guardar fotos 
        if (propiedadDto.UrlFotos && propiedadDto.UrlFotos.length > 0) {
            const fotoRepo = AppDataSource.getRepository(PropiedadFoto);
            
            const fotosAInsertar = propiedadDto.UrlFotos.map((ruta: string) => ({
                ruta_foto: ruta,
                propiedad: { id: propiedad.id } 
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
