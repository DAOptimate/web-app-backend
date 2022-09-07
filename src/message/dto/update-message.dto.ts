import { IsNotEmpty } from 'class-validator';

export class UpdateMessageDto {
  @IsNotEmpty()
  isRead: boolean;
}
