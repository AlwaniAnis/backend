import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Requests } from './entities/request.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Requests])],
  controllers: [RequestsController],
  providers: [RequestsService, Repository<Requests>],
})
export class RequestsModule {}
