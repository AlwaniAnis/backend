import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { FilterDto } from './dto/filter.dto';

@ApiTags('requests') // Group the endpoints under the "requests" tag in Swagger
@ApiBearerAuth() // Indicate that these endpoints require a Bearer token
@Controller('requests')
@UseGuards(AuthGuard('jwt')) // Apply AuthGuard to all routes in this controller
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new request' })
  @ApiBody({ type: CreateRequestDto })
  create(@Body() createRequestDto: CreateRequestDto, @Request() req: any) {
    const user = req.user; // Assuming the user object is attached by the AuthGuard
    console.log('User from request:', user); // Log the user object for debugging
    return this.requestsService.create(createRequestDto, user.id); // Pass user ID to the service
  }
  @Get()
  @ApiQuery({ name: 'searchTerm', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'urgencyLevel', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @Query() filter: FilterDto,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Request() req: any,
  ) {
    const user = req.user;
    if (!user.roles.find((u) => u == 'admin')) {
      filter.userId = user.id;
    }
    console.log('Filter:', filter); // Log the filter object for debugging
    return this.requestsService.findAll(filter, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single request by ID' })
  @ApiParam({ name: 'id', description: 'ID of the request to retrieve' })
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a request by ID' })
  @ApiParam({ name: 'id', description: 'ID of the request to update' })
  @ApiBody({ type: UpdateRequestDto })
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestsService.update(+id, updateRequestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a request by ID' })
  @ApiParam({ name: 'id', description: 'ID of the request to delete' })
  remove(@Param('id') id: string) {
    return this.requestsService.remove(+id);
  }
  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject a request by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'ID of the request to reject' })
  reject(@Param('id') id: string, @Body('note') note: string, @Request() req: any) {
    const user = req.user;
    // if (user.role !== 'admin') {
    //   throw new ForbiddenException('Only admins can reject requests');
    // }
    return this.requestsService.reject(+id, note);
  }

  @Patch(':id/validate')
  @ApiOperation({ summary: 'Validate a request by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'ID of the request to validate' })
  validate(@Param('id') id: string, @Body('note') note: string, @Request() req: any) {
    const user = req.user;
    // if (user.role !== 'admin') {
    //   throw new ForbiddenException('Only admins can validate requests');
    // }
    return this.requestsService.validate(+id, note);
  }
}
