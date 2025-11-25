import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';

// DTOs correctos (ubicados en src/user/userDto)
import { CreateUserDto } from './userDto/create-user.dto';
import { UpdateUserDto } from './userDto/update-user.dto';
import { RateUserDto } from './userDto/rate-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @Post(':id/calificar')
  calificarUsuario(
    @Param('id') usuarioId: number,
    @Body() dto: RateUserDto
  ) {
    return this.userService.calificarUsuario(usuarioId, dto);
  }
  // Agregar solo para que admin use
  @Post('RegistrarTecnico')
  RegistrarTecnico(@Body() createUserDto: CreateUserDto) {
    return this.userService.RegistrarTecnico(createUserDto);
  }
}
