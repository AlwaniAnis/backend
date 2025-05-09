import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersModule } from '@/users/users.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule, // ✅ brings UserService and UserRepository
    JwtModule.register({
      secret: 'myhardcodedsecret', // Temporarily hardcode to test
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Ensure UserService and JwtService are provided
})
export class AuthModule {
  constructor() {
    console.log('JWT_SECRET:', process.env.JWT_SECRET); // Check if the JWT_SECRET is being loaded correctly
  }
}
