import { BusinessException} from '../Exceptions/BussinessException';
import AppDataSource from "src/data-source";
import { User } from "src/entity/user.entity";
import { CreateUserDto } from 'src/user/userDto/create-user.dto';
    
    export class UserRules {
        
        static ValidarUsuarioExistente(usuario: User): void {
            if (usuario) {
                throw new BusinessException('El usuario ya existe');
            }
        }

        static ValidarDtoCrearUsuario(dto: CreateUserDto): void {
            if (!dto.nombre || dto.nombre.trim() === '') {
                throw new BusinessException('El nombre es requerido');
            }
            if (!dto.apellido || dto.apellido.trim() === '') {
                throw new BusinessException('El apellido es requerido');
            }
            if (!dto.email || dto.email.trim() === '') {
                throw new BusinessException('El email es requerido');
            }
            if (!dto.password || dto.password.trim() === '') {
                throw new BusinessException('La contraseña es requerida');
            }
        }


            
        
    }