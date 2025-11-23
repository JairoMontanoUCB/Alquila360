import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/userDto/login-user.dto';
import { RegisterUserDto } from './dto/userDto/register-user.dto';
import { CreateUserDto } from 'src/user/userDto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // LOGIN
  @Post('login')
  login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }

  // REGISTER (opcional, si quieres crear usuarios desde auth)
 @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }
}
