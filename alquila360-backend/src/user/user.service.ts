import { Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { User } from "src/entity/user.entity";
import { UserRating } from "src/entity/user_rating.entity";
import { CreateUserDto } from "./userDto/create-user.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
    
    async createUser(dto: CreateUserDto) {
    const repo = AppDataSource.getRepository(User);
    const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(dto.password, salt);


    const newUser = repo.create({
        nombre: dto.nombre,
        apellido: dto.apellido,
        email: dto.email,
        rol: 'inquilino',   // <--- rol fijo
        estado: 'activo',
        password_hash: hashedPassword,
        fecha_registro: new Date()
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
