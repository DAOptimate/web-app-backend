import { IsNotEmpty, Length } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  messageId: string;

  @IsNotEmpty()
  content: string;
}
