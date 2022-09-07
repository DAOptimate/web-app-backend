import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Message } from '../message/entities/message.entity';
import { MessageService } from '../message/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Note, Message])],
  controllers: [NoteController],
  providers: [NoteService, MessageService],
})
export class NoteModule {}
