import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { UserItemDto } from './dto/userItem.dto'; // Import the DTO

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<UserItemDto[]> {
    // adding filter && pagination functionalities to the findAll method later !!!!

    const users = await this.userRepository.find();
    return users.map((user) => new UserItemDto(user));
  }

  async findOne(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  // async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {  //   // to add update user functionality later !!!
  //   await this.userRepository.update(id, updateUserDto);
  //   return await this.userRepository.findOne({ where: { id } });
  // }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { username } });
  }
}
