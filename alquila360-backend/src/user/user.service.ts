import { Injectable } from "@nestjs/common";
import AppDataSource from "src/data-source";
import { User } from "src/entity/user.entity";
import { UserRating } from "src/entity/user_rating.entity";
import { CreateUserDto } from "./userDto/create-user.dto";
import { RateUserDto } from "./userDto/rate-user.dto";
import * as bcrypt from "bcryptjs";
import { UserRules } from "src/common/Rules/UserRules";

@Injectable()
export class UserService {
    
  async createUser(dto: CreateUserDto) {
    const repo = AppDataSource.getRepository(User);

    // Generar hash de contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // Crear usuario por defecto como inquilino
    const newUser = repo.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      rol: "inquilino",
      estado: "activo",
      password_hash: hashedPassword,
      fecha_registro: new Date(),
    });

    return repo.save(newUser);
  }

  async getAllUsers() {
    return AppDataSource.getRepository(User).find();
  }

  async getUserById(id: number) {
    return AppDataSource.getRepository(User).findOne({ where: { id } });
  }

  async getUserByEmail(email: string) {
    return AppDataSource.getRepository(User).findOne({ where: { email } });
  }

  async updateUser(id: number, userData: Partial<User>) {
    await AppDataSource.getRepository(User).update(id, userData);
    return this.getUserById(id);
  }

  async deleteUser(id: number) {
    return AppDataSource.getRepository(User).delete(id);
  }

  // -----------------------------------------------------
  // ⭐ CALIFICAR USUARIO (Inquilino o Técnico)
  // -----------------------------------------------------
 async calificarUsuario(usuarioId: number, dto: RateUserDto) {
    const usuarioRepo = AppDataSource.getRepository(User);
    const ratingRepo = AppDataSource.getRepository(UserRating);

    const usuario = await usuarioRepo.findOne({ where: { id: usuarioId } });
    if (!usuario) throw new Error("El usuario a calificar no existe.");

    const autor = await usuarioRepo.findOne({ where: { id: dto.autorId } });
    if (!autor) throw new Error("El autor de la calificación no existe.");

    if (dto.estrellas < 1 || dto.estrellas > 5) {
        throw new Error("Las estrellas deben estar entre 1 y 5.");
    }

    const nuevaCalificacion = ratingRepo.create({
        estrellas: dto.estrellas,
        comentario: dto.comentario ?? undefined,  // <--- CORREGIDO
        usuario: { id: usuarioId },               // <--- CORRECTO
        autor: { id: dto.autorId },               // <--- CORRECTO
        fecha: new Date()
    });

    await ratingRepo.save(nuevaCalificacion);

    usuario.ratingTotal += dto.estrellas;
    usuario.ratingCount += 1;
    usuario.ratingPromedio = usuario.ratingTotal / usuario.ratingCount;

    await usuarioRepo.save(usuario);

    return {
        message: "Calificación registrada correctamente",
        ratingPromedio: usuario.ratingPromedio,
        ratingCount: usuario.ratingCount
    };
  }

  async RegistrarTecnico(dto: CreateUserDto) {
    var repo = AppDataSource.getRepository(User);

    var existingUser = await repo.findOne({ where: { email: dto.email } });

    UserRules.ValidarUsuarioExistente(existingUser!);

    UserRules.ValidarDtoCrearUsuario(dto); //Valida todos los datos del DTO
    
    // Generar hash de contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // Crear usuario por defecto como técnico
    const newUser = repo.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      rol: "tecnico",
      estado: "activo",
      password_hash: hashedPassword,
      fecha_registro: new Date(),
    });

    return repo.save(newUser);
  }
}
