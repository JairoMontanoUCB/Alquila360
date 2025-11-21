import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'super_secreto_123', // usa el mismo del módulo
    });
  }

  async validate(payload: any) {
    return {
      id: payload.id,
      email: payload.email,
      rol: payload.rol,
    };
  }
}
