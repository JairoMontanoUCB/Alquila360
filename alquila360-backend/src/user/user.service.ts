import { Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { User } from "src/entity/user.entity";
import { UserRating } from "src/entity/user_rating.entity";
import { CreateUserDto } from "./userDto/create-user.dto";

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
    async calificarUsuario(usuarioId: number, body: any) {
    const usuarioRepo = AppDataSource.getRepository(User);
    const ratingRepo = AppDataSource.getRepository(UserRating);

    const usuario = await usuarioRepo.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new Error("Usuario no encontrado");

    if (body.estrellas < 1 || body.estrellas > 5)
        throw new Error("La calificación debe ser entre 1 y 5 estrellas");

    const autor = await usuarioRepo.findOne({ where: { id: body.autorId } });
    if (!autor) throw new Error("Autor no encontrado");

    // Crear nueva calificación
    const nuevaCalificacion = ratingRepo.create({
        estrellas: body.estrellas,
        comentario: body.comentario ?? null,
        usuario,
        autor,
        fecha: new Date()
    });

    await ratingRepo.save(nuevaCalificacion);

    // Recalcular promedio
    usuario.ratingTotal += body.estrellas;
    usuario.ratingCount += 1;
    usuario.ratingPromedio = usuario.ratingTotal / usuario.ratingCount;

    await usuarioRepo.save(usuario);

    return {
        message: "Calificación registrada",
        ratingPromedio: usuario.ratingPromedio,
        ratingCount: usuario.ratingCount
    };
}

}
