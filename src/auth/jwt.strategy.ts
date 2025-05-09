import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { UserService } from '../users/user.service';
import { JwtPayload } from './jwt-payload.interface';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myhardcodedsecret',
    });
  }

  async validate(payload: JwtPayload) {
    console.log('Decoded JWT Payload:', payload);

    const user = await this.usersService.findOne(payload.sub); // Ensure this method is working
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
