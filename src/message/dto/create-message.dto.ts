import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Length(1, 100)
  company: string;

  @IsNotEmpty()
  @Length(1, 500)
  message: string;
}
