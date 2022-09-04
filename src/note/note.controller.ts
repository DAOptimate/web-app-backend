import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  // Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
// import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createNoteDto: CreateNoteDto) {
    const { messageId, ...createNoteParams } = createNoteDto;
    return this.noteService.create(+messageId, createNoteParams);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.noteService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
  //   return this.noteService.update(+id, updateNoteDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.noteService.remove(+id);
  // }
}
