import { IsOptional, IsEnum, IsString } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @IsEnum(['pending', 'validated', 'rejected'])
  status?: 'pending' | 'validated' | 'rejected';

  @IsOptional()
  @IsEnum(['Normal', 'Urgent', 'Critical'])
  urgencyLevel?: 'Normal' | 'Urgent' | 'Critical';

  @IsOptional()
  userId?: number;
}
