import { Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { User } from "src/entity/user.entity";
import { CreateUserDto } from "src/auth/dto/userDto/create-user.dto";
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
    constructor(private readonly emailService: EmailService) {}

    async createUser(dto: CreateUserDto) {
        const repo = AppDataSource.getRepository(User);
        
        const newUser = repo.create({
            nombre: dto.nombre,
            apellido: dto.apellido,
            email: dto.email,
            rol: dto.rol,
            estado: 'activo',
            password_hash: dto.password, // luego le hacemos hash
        });

        const savedUser = await repo.save(newUser);

        // Enviar correo
        await this.emailService.sendWelcomeEmail(savedUser.email, savedUser.nombre);


        return savedUser;
    }

    async getAllUsers() {
        return await AppDataSource.getRepository(User).find();
    }

    async getUserById(id: number) {
        return await AppDataSource.getRepository(User).findOneBy({ id }); 
    }

    async getUserByEmail(email: string) {
        return await AppDataSource.getRepository(User).findOneBy({ email }); 
    }

    async updateUser(id: number, userData: Partial<User>) {
        await AppDataSource.getRepository(User).update(id, userData);
        return this.getUserById(id);
    }

    async deleteUser(id: number) {
        return await AppDataSource.getRepository(User).delete(id);
    }

    
}
