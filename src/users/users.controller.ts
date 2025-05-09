import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@common/roles.guard'; // Corrected path to RolesGuard
import { Roles } from '@common/roles.decorator'; // Import your custom Roles decorator

@ApiTags('users') // Group the endpoints under the "users" tag in Swagger
@ApiBearerAuth() // Add the Bearer token authentication to Swagger
@Controller('users')
@UseGuards(AuthGuard('jwt')) // Apply AuthGuard to the entire controller
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @Roles('admin') // Only users with the 'admin' role can access this route
  @UseGuards(RolesGuard) // Apply the RolesGuard
  @ApiOperation({ summary: 'Get all users' }) // Add a summary for the endpoint
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    // adding filter && pagination functionalities to the findAll method later !!!!
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' }) // Add a summary for the endpoint
  @ApiParam({ name: 'id', required: true, description: 'ID of the user to retrieve' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  @Roles('admin') // Only users with the 'admin' role can access this route
  @UseGuards(RolesGuard) // Apply the RolesGuard
  @ApiOperation({ summary: 'Delete a user by ID' }) // Add a summary for the endpoint
  @ApiParam({ name: 'id', required: true, description: 'ID of the user to delete' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
