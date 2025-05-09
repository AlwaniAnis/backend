import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto'; // Updated import
import { LoginDto } from './dto/login.dto';

@ApiTags('auth') // Grouping the endpoints under the "auth" tag in Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  register(@Body() registerDto: RegisterDto) {
    // Updated parameter type
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('add-admin')
  @ApiOperation({ summary: 'Add an admin if not exists' })
  @ApiResponse({ status: 201, description: 'Admin added successfully or already exists.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async addAdmin(@Body() registerDto: RegisterDto) {
    return this.authService.addAdminIfNotExists(registerDto);
  }
}
