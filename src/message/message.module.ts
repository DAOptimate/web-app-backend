import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Note } from '../note/entities/note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Note])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
