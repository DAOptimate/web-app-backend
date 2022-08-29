import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'message' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  company: string;

  @Column()
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: new Date().getTime() / 1000 })
  date: number;
}
