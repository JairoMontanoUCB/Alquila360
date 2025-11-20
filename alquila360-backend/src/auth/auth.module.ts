import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [UserModule,JwtModule.register({
      global: true,
      secret: 'super_secreto_123',   // cámbialo luego
      signOptions: { expiresIn: '7d' },
    }),],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
