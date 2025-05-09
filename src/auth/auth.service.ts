import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService, // Inject JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, password } = registerDto;
    const userExists = await this.userService.findByUsername(username);

    if (userExists) {
      return 'User already exists';
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user = new User();
    user = { ...user, ...registerDto, username, password: hashedPassword, roles: ['user'] }; // Set default role to 'user'
    let a = await this.userService.create(user);
    console.log(a);
    return 'User registered successfully';
  }
  async addAdminIfNotExists(registerDto: RegisterDto): Promise<string> {
    const { username } = registerDto;
    const adminExists = await this.userService.findByUsername(username);

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      let admin = new User();
      admin = {
        ...admin,
        ...registerDto,
        username,
        password: hashedPassword,
        roles: ['admin'], // Set role to 'admin'
      };
      await this.userService.create(admin);
      return 'Admin added successfully.';
    }
    return 'Admin already exists.';
  }
  async login(loginDto: LoginDto) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    } else {
      console.log('JWT_SECRET:', process.env.JWT_SECRET); // Check if the JWT_SECRET is being loaded correctly
    }
    const { username, password } = loginDto;
    const user = await this.userService.findByUsername(username);

    if (!user) {
      return 'Invalid credentials';
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return 'Invalid credentials';
    }
    console.log(user);
    // Generate JWT
    const payload = { username: user.username, sub: user.id, roles: user.roles };
    const token = this.jwtService.sign(payload);

    // Return JWT and some user info
    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        firstName: user.firstName,
        lastName: user.lastName, // Include roles if needed
      },
    };
  }
}
