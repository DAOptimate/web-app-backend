import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateMessageDto {
  @Length(1, 100)
  name: string;

  @IsEmail()
  email: string;

  company: string;

  @Length(15, 500)
  message: string;
}
