import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../message/entities/message.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
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

  // findOne(id: number) {
  //   return `This action returns a #${id} note`;
  // }

  // update(id: number, updateNoteDto: UpdateNoteDto) {
  //   return `This action updates a #${id} note`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} note`;
  // }
}
