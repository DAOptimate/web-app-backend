import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Message } from '../../message/entities/message.entity';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Message, (message) => message.notes, {
    onDelete: 'CASCADE',
  })
  message: Message;
}
