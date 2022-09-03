import { IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'note' })
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  messageId: string;

  //   @Column()
  //   author: string;

  @Column()
  @IsNotEmpty()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
