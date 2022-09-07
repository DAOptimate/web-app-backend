import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../message/entities/message.entity';
import { Note } from './entities/note.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note) private noteRepository: Repository<Note>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async create(messageId: number, createNoteParams: { content: string }) {
    const message = await this.messageRepository.findOneBy({ id: messageId });
    if (!message)
      throw new HttpException(
        'Message not found, cannot create note.',
        HttpStatus.BAD_REQUEST,
      );
    const newNote = this.noteRepository.create({
      ...createNoteParams,
      message,
    });
    return this.noteRepository.save(newNote);
  }

  async findAll() {
    return this.noteRepository.find();
  }
}
