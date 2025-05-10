import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Requests } from './entities/request.entity';
import { NotificationsGateway } from '@/notifications/notifications.gateway';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Requests)
    private readonly requestsRepository: Repository<Requests>,
    private readonly gateway: NotificationsGateway,
  ) {}

  async create(createRequestDto: CreateRequestDto, userId: number): Promise<Requests> {
    const requests = this.requestsRepository.create({ ...createRequestDto, userId });
    const res = await this.requestsRepository.save(requests);

    this.gateway.sendToAdmins('📥 A new request has been submitted.');
    return res;
  }

  async findAll(
    filter: {
      searchTerm?: string;
      status?: 'pending' | 'validated' | 'rejected';
      urgencyLevel?: 'Normal' | 'Urgent' | 'Critical';
      userId?: number;
    } = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Requests[]; total: number }> {
    const qb = this.requestsRepository.createQueryBuilder('request');

    if (filter.searchTerm) {
      console.log('Search term:', filter.searchTerm); // Log the search term for debugging
      qb.where(
        'request.title LIKE :term OR request.description LIKE :term OR request.category LIKE :term',
        { term: `%${filter.searchTerm}%` },
      );
    }

    if (filter.status) {
      if (filter.searchTerm) {
        qb.andWhere('request.status = :status', { status: filter.status });
      } else {
        qb.where('request.status = :status', { status: filter.status });
      }
    }

    if (filter.urgencyLevel) {
      if (filter.searchTerm || filter.status) {
        qb.andWhere('request.urgencyLevel = :urgencyLevel', {
          urgencyLevel: filter.urgencyLevel,
        });
      } else {
        qb.where('request.urgencyLevel = :urgencyLevel', {
          urgencyLevel: filter.urgencyLevel,
        });
      }
    }

    if (filter.userId) {
      if (filter.searchTerm || filter.status || filter.urgencyLevel) {
        qb.andWhere('request.userId = :userId', { userId: filter.userId });
      } else {
        qb.where('request.userId = :userId', { userId: filter.userId });
      }
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async findOne(id: number): Promise<Requests | null> {
    return await this.requestsRepository.findOne({ where: { id } });
  }

  async update(id: number, updateRequestDto: UpdateRequestDto): Promise<Requests | null> {
    await this.requestsRepository.update(id, updateRequestDto);
    return await this.requestsRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.requestsRepository.delete(id);
  }

  async reject(id: number, note: string): Promise<Requests | null> {
    await this.requestsRepository.update(id, { status: 'rejected', note });
    const request = await this.requestsRepository.findOne({ where: { id } });
    if (request) {
      this.gateway.sendToUser(
        request.userId.toString(),
        `Your request ${request.title} has been rejected. Note: ${note}`,
      );
    }
    return request;
  }

  async validate(id: number, note: string): Promise<Requests | null> {
    await this.requestsRepository.update(id, { status: 'validated', note });
    const request = await this.requestsRepository.findOne({ where: { id } });
    if (request) {
      this.gateway.sendToUser(
        request.userId.toString(),
        `Your request ${request.title} has been validated. Note: ${note}`,
      );
    }
    return request;
  }
}
