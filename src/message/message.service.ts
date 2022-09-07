import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const newMessage = this.messageRepository.create(createMessageDto);
    await this.messageRepository.save(newMessage);
  }

  findAll() {
    return this.messageRepository.find();
  }

  findById(id: number) {
    return this.messageRepository.findOne({
      where: { id },
      relations: ['notes'],
    });
  }

  async updateById(id: number, updateMessageDto: UpdateMessageDto) {
    const message = await this.messageRepository.findOneBy({ id });

    if (!message)
      throw new HttpException(
        'Message not found, cannot create note.',
        HttpStatus.BAD_REQUEST,
      );

    const updatedMessage = await this.messageRepository.save({
      ...message,
      ...updateMessageDto,
    });

    return updatedMessage;
  }
}
