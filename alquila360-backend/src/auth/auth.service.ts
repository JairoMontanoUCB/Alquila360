import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/userDto/login-user.dto';
import { RegisterUserDto } from './dto/userDto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UserService,
    private readonly jwtService: JwtService
  ) {}

  // --------------------------
  // LOGIN
  // --------------------------
  async login(loginDto: LoginUserDto) {
    const { email, password } = loginDto;

    const usuario = await this.usuariosService.getUserByEmail(email);

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar contraseña (bcrypt)
    const passwordValid = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // Generar token real
    const token = this.jwtService.sign({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    return {
      message: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
      },
      token,
    };
  }

  // --------------------------
  // REGISTER — Rol siempre INQUILINO
  // --------------------------
  async register(dto: RegisterUserDto) {
    return this.usuariosService.registerUser(dto);
  }
}
