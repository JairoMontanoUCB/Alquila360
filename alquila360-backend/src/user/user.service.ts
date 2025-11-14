import { Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { User } from "src/entity/user.entity";
import { CreateUserDto } from "src/auth/dto/userDto/create-user.dto";

@Injectable()
export class UserService {
    
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

        return repo.save(newUser);
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
