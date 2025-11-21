import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ExpensaService } from "./expensa.service";
import { CreateExpensaDto } from "./expensaDto/create-expensa.dto";
import { UpdateExpensaDto } from "./expensaDto/update-expensa.dto";

@Controller('expensas')
export class ExpensaController {
    constructor(private readonly expensaService: ExpensaService) {}

    @Post()
    create(@Body() dto: CreateExpensaDto) {
        return this.expensaService.createExpensa(dto);
    }

    @Get()
    getAll() {
        return this.expensaService.getAllExpensas();
    }

    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.expensaService.getExpensaById(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() dto: UpdateExpensaDto) {
        return this.expensaService.updateExpensa(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.expensaService.deleteExpensa(id);
    }
}
