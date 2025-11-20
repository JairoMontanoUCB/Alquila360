import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,   // 👈 NECESARIO
    JwtModule.register({
      global: true,
      secret: 'super_secreto_123',   // mueve a .env después
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // 👈 REGISTRAR LA ESTRATEGIA
  exports: [AuthService],
})
export class AuthModule {}
