import { Injectable, Logger, OnModuleInit } from '@nestjs/common'; // <-- Importar OnModuleInit
import AppDataSource from "src/data-source";
import { Cuota } from 'src/entity/cuota.entity';
import { User } from "src/entity/user.entity";
import { LessThan, In} from 'typeorm';
import { BusinessException } from 'src/common/Exceptions/BussinessException';
import { Contrato } from 'src/entity/contrato.entity';
@Injectable()
export class BloqueoMoraService implements OnModuleInit {
    private readonly logger = new Logger(BloqueoMoraService.name);

    // ⏰ Define el intervalo de verificación:
    // 86,400,000 milisegundos = 24 horas (una vez al día)
    private readonly CHECK_INTERVAL = 86400000;

    //  Método que se ejecuta al iniciar el módulo
    onModuleInit() {
        this.logger.log('BloqueoMoraService inicializado. Programando chequeo diario.');
    
        // Ejecuta la función de chequeo inmediatamente al iniciar
        this.handleBloqueoAutomatico();

        // Luego, programa la función para que se ejecute cada 24 horas
        setInterval(() => {
            this.handleBloqueoAutomatico();
        }, this.CHECK_INTERVAL);
    }

    // El método de la lógica de bloqueo se mantiene igual
    async handleBloqueoAutomatico() {
        // ...
        // Obtener todos los usuarios activos que podrían tener expensas (inquilinos/propietarios)
        const usuariosA_Verificar = await AppDataSource.getRepository(User).find({
            where: {
                rol: In(['inquilino', 'propietario', 'administrador']), // Incluye roles que puedan tener expensas
                estado: 'activo'
            },
        });

        for (const usuario of usuariosA_Verificar) {
            // Nota: Si solo inquilinos deben pagar expensas, podrías filtrar más aquí.
            const tieneMora = await this.verificarMoraDeTresMeses(usuario.id);
      
            if (tieneMora) {
                await this.bloquearUsuario(usuario); // <-- Le pasamos el objeto usuario
            }
        }
        // ...
    }

    // METODOS VERIFICAR MORA DE TRES MESES
    // Los métodos : verificarMoraDeTresMeses y bloquearUsuario
    
    private async verificarMoraDeTresMeses(usuarioId: number): Promise<boolean> {
        // 1. Obtener Contratos del Inquilino
    const contratos = await AppDataSource.getRepository(Contrato).find({
        where: { inquilinoId: usuarioId }, // Usando la propiedad corregida
        select: ['id'], 
    });
    
    //  2. DECLARACIÓN DE CONTRATOIDS (Aquí se crea la variable)
    const contratoIds = contratos.map(c => c.id); 
    
    if (contratoIds.length === 0) {
        return false;
    }
    
    const today = new Date();
    
    // Obtener CUOTAS DE EXPENSAS pendientes que ya VENCIRON.
    const cuotasMorosas = await AppDataSource.getRepository(Cuota).find({
        where: {
            //  3. USAR EL OPERADOR In CON LA VARIABLE
            contrato_id: In(contratoIds), 
            tipo: 'EXPENSA', 
            estado: 'pendiente',
            fecha_vencimiento: LessThan(today),
        },
        order: { fecha_vencimiento: 'ASC' },
    });

    // contar meses únicos)
    const mesesMorosos = new Set<string>(); 
    
    return mesesMorosos.size >= 3;

    }
    private async bloquearUsuario(usuario: User): Promise<void>{
        //  VALIDACIÓN CLAVE: No bloquear administradores
    if (usuario.rol === 'administrador') {
        this.logger.warn(`El usuario ID ${usuario.id} tiene rol 'administrador' y no puede ser bloqueado por mora.`);
        // Dependiendo de tu lógica de negocio, podrías lanzar una excepción
        // throw new BusinessException(`El administrador ID ${usuario.id} tiene mora pero no puede ser bloqueado.`);
        return; // Simplemente salimos de la función sin hacer nada.
    }
        
    // z VALIDACIÓN ADICIONAL: Solo bloquear si el usuario está actualmente activo
    if (usuario.estado !== 'activo') {
        this.logger.log(`Usuario ID ${usuario.id} ya no está activo (${usuario.estado}). Bloqueo omitido.`);
        return;
    }
    
    this.logger.warn(`Bloqueando usuario ID ${usuario.id} (Rol: ${usuario.rol}) por 3 o más meses de mora en expensas.`);
    
    usuario.estado = 'bloqueado';
    await AppDataSource.getRepository(User).save(usuario);
    }

}