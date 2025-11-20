import { BusinessException} from '../Exceptions/BussinessException';
    import AppDataSource from "src/data-source";
    import { User } from "src/entity/user.entity";
    import { Propiedad } from "src/entity/propiedad.entity";
import { CreatePropiedadDto } from 'src/propiedad/propiedadDto/create-propiedad.dto';
    
    export class PropiedadRules {
        
        static ValidarPropietario(propietario: User): void {
            if (!propietario || propietario.id <= 0) {
                throw new BusinessException('El ID del propietario es inválido');
            }
        }

        static ValidarDatosContrato(propiedadDto: CreatePropiedadDto): void {
            if (!propiedadDto.tipo) {
                throw new BusinessException('El tipo de propiedad es requerido');
            }
            // Validar tipos de propiedad permitidos
            const tiposValidos = ['casa', 'departamento', 'local', 'otro'];
            if (!tiposValidos.includes(propiedadDto.tipo.toLowerCase())) {
            throw new BusinessException(`Tipo de propiedad inválido. Valores permitidos: ${tiposValidos.join(', ')}`);
            }
            if (propiedadDto.direccion && propiedadDto.direccion.trim() === '') {
                throw new BusinessException('La dirección no puede estar vacía');
            }
            if (propiedadDto.ciudad && propiedadDto.ciudad.trim() === '') {
                throw new BusinessException('La ciudad no puede estar vacía');
            }
            
        }
    }