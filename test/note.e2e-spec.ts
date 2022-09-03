import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MessageModule } from '../src/message/message.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../src/message/entities/message.entity';
import { Repository } from 'typeorm';
import { Note } from '../src/note/entities/note.entity';
import { NoteModule } from '../src/note/note.module';

describe('NoteController (e2e)', () => {
  let app: INestApplication;
  let noteRepository: Repository<Note>;
  let messageRepository: Repository<Message>;
  let message: Message;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3308,
          username: 'root',
          password: 'password',
          database: 'daoptimate_test_db',
          entities: [Message, Note],
          synchronize: true,
        }),
        MessageModule,
        NoteModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    noteRepository = app.get('NoteRepository');
    messageRepository = app.get('MessageRepository');

    await app.init();
  });

  beforeAll(async () => {
    await noteRepository.query('DELETE FROM note;');
    await messageRepository.query('DELETE FROM message;');

    const messageData = messageRepository.create({
      name: 'satoshi',
      email: 'invalid_email',
      company: 'bitcoin ltd',
      message: 'plz where are my keys',
    });
    message = await messageRepository.save(messageData);
  });

  beforeEach(async () => {
    await noteRepository.query('DELETE FROM note;');
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * CREATE
   */
  it('/note (POST) should save a new note', async () => {
    const notesBefore = await noteRepository.find();
    expect(notesBefore).toHaveLength(0);

    const newNote = {
      messageId: message.id,
      content: 'im writing a note!',
    };

    await request(app.getHttpServer()).post('/note').send(newNote).expect(201);

    const notesAfter = await noteRepository.find();
    expect(notesAfter.length).toBe(notesBefore.length + 1);
  });

  /**
   * Invalid Requests
   */
  it('/note (POST) should reject invalid requests', async () => {
    const missingMessageIdResponse = await request(app.getHttpServer())
      .post('/note')
      .send({
        content: 'here is some note text',
      })
      .expect(400);

    expect(missingMessageIdResponse.body.message).toHaveLength(1);
    expect(missingMessageIdResponse.body.message).toContain(
      'messageId should not be empty',
    );

    const missingContentResponse = await request(app.getHttpServer())
      .post('/note')
      .send({
        messageId: 'realid',
      })
      .expect(400);

    expect(missingContentResponse.body.message).toHaveLength(1);
    expect(missingContentResponse.body.message).toContain(
      'content should not be empty',
    );

    const noDataResponse = await request(app.getHttpServer())
      .post('/note')
      .send({})
      .expect(400);

    expect(noDataResponse.body.message).toHaveLength(2);
    expect(noDataResponse.body.message).toContain(
      'messageId should not be empty',
    );
    expect(noDataResponse.body.message).toContain(
      'content should not be empty',
    );
  });

  /**
   * READ
   */

  //   xit('/note (GET) should return all messages', async () => {
  //     await noteRepository.save([
  //       {
  //         messageId: 'satoshi',
  //         author: 'satoshi@bitcoin.com',
  //         content: 'bitcoin plc',
  //         created: 'plz where are my keys',
  //       },
  //       {
  //         messageId: 'satoshi',
  //         author: 'satoshi@bitcoin.com',
  //         content: 'bitcoin plc',
  //         created: 'plz where are my keys',
  //       },
  //     ]);

  //     const response = await request(app.getHttpServer())
  //       .get('/note')
  //       .expect(200);

  //     expect(response.body).toHaveLength(2);
  //   });
});
