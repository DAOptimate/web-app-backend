import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createNoteDto: CreateNoteDto) {
    const { messageId, ...createNoteParams } = createNoteDto;
    return this.noteService.create(+messageId, createNoteParams);
  }
}
