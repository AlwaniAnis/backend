import { User } from '../../users/entities/user.entity'; // Adjust the import path as needed
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Requests {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  category: string;

  @Column({ type: 'enum', enum: ['Normal', 'Urgent', 'Critical'] })
  urgencyLevel: 'Normal' | 'Urgent' | 'Critical';

  @Column({ type: 'enum', enum: ['pending', 'validated', 'rejected'], default: 'pending' })
  status: 'pending' | 'validated' | 'rejected'; // Add the status column

  @ManyToOne(() => User, (user) => user.requests)
  @JoinColumn({ name: 'userId' }) // Explicitly specify the foreign key column
  user: User;

  @Column()
  userId: number; // Add the userId column

  @Column({ type: 'text', nullable: true })
  note: string; // Add the note column

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Automatically set when the entity is created

  @UpdateDateColumn()
  updatedAt: Date; // Automatically updated when the entity is updated
}
