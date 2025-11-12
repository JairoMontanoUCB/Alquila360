import { Inject, Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Pago } from "src/entity/pago.entity";

@Injectable()
export class PagoService {
    async createPago(pago:Pago)
    {
        return await AppDataSource.getRepository(Pago).save(pago);
    }

    async getAllPago()
    {
        return await AppDataSource.getRepository(Pago).find();
    }
    async getPagoById(id:number)
    {
        return await AppDataSource.getRepository(Pago).findOneBy({id}); 
    }
    async updatePago(id:number, pagoData : Partial<Pago>)
    {
        return await AppDataSource.getRepository(Pago).update(id, pagoData);
        return this.getPagoById(id);
    }
    async deletePago(id:number)
    {
        return await AppDataSource.getRepository(Pago).delete(id);
    }

}