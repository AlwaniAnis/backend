import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({ description: 'The title of the request' })
  title: string;

  @ApiProperty({ description: 'The description of the request' })
  description: string;

  @ApiProperty({ description: 'The category of the request' })
  category: string;

  @ApiProperty({
    description: 'The urgency level of the request',
    enum: ['Normal', 'Urgent', 'Critical'],
  })
  urgencyLevel: 'Normal' | 'Urgent' | 'Critical';
  // Assuming userId is passed in the request body
}
