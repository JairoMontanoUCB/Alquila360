import { Injectable, NotFoundException } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { Expensa } from "src/entity/expensa.entity";
import { CreateExpensaDto } from "./expensaDto/create-expensa.dto";
import { UpdateExpensaDto } from "./expensaDto/update-expensa.dto";

@Injectable()
export class ExpensaService {

    private expensaRepo = AppDataSource.getRepository(Expensa);

    async createExpensa(dto: CreateExpensaDto): Promise<Expensa> {
        const expensa = this.expensaRepo.create({
            ...dto,
            propiedad: { id: dto.propiedadId },
            contrato: { id: dto.contratoId },
        });

        return this.expensaRepo.save(expensa);
    }

    async getAllExpensas(): Promise<Expensa[]> {
        return this.expensaRepo.find({
            relations: ["propiedad", "contrato"]
        });
    }

    async getExpensaById(id: number): Promise<Expensa> {
        const expensa = await this.expensaRepo.findOne({
            where: { id },
            relations: ["propiedad", "contrato"]
        });
        if (!expensa) throw new NotFoundException(`Expensa con id ${id} no encontrada`);
        return expensa;
    }

    async updateExpensa(id: number, dto: UpdateExpensaDto): Promise<Expensa> {
        await this.expensaRepo.update(id, dto);
        return this.getExpensaById(id);
    }

    async deleteExpensa(id: number): Promise<void> {
        const result = await this.expensaRepo.delete(id);
        if (result.affected === 0) throw new NotFoundException(`Expensa con id ${id} no encontrada`);
    }
}
