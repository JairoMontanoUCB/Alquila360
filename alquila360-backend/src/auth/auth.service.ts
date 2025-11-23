import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from './dto/userDto/login-user.dto';
import { CreateUserDto } from './dto/userDto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private usuariosService: UserService) {}

  async login(loginDto: LoginUserDto) {
    const { email, password } = loginDto;

    const usuario = await this.usuariosService.getUserByEmail(email);

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (usuario.password_hash !== password) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    return {
      message: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
      token: "TOKEN_DE_EJEMPLO"
    };
  }

  async register(createUserDto: CreateUserDto) {
    return this.usuariosService.createUser(createUserDto);
  }
}
