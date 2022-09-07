import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MessageModule } from '../src/message/message.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../src/message/entities/message.entity';
import { Repository } from 'typeorm';
import { Note } from '../src/note/entities/note.entity';

describe('MessageController (e2e)', () => {
  let app: INestApplication;
  let messageRepository: Repository<Message>;
  let noteRepository: Repository<Note>;
  let message1: Message;

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
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    messageRepository = app.get('MessageRepository');
    noteRepository = app.get('NoteRepository');

    await messageRepository.query('DELETE FROM message;');
    await messageRepository.query('DELETE FROM note;');

    const message1Data = messageRepository.create({
      name: 'Bryan',
      email: 'brian@cryptopumps.com',
      company: 'crypto pumps',
      message: 'we do best crypto pumps call now for win',
    });
    message1 = await messageRepository.save(message1Data);
    const note1 = noteRepository.create({
      message: message1,
      content: "I'm a note attached to message1",
    });
    const note2 = noteRepository.create({
      message: message1,
      content: "I'm another note attached to message1",
    });
    await noteRepository.save([note1, note2]);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * CREATE
   */
  it('/message (POST) should save a new message', async () => {
    // message table should have the one message we created in beforeAll()
    const messagesBefore = await messageRepository.find();
    expect(messagesBefore).toHaveLength(1);

    const message = {
      name: 'satoshi',
      email: 'satoshi@bitcoin.com',
      company: 'bitcoin plc',
      message: 'plz where are my keys',
    };

    await request(app.getHttpServer())
      .post('/message')
      .send(message)
      .expect(201);

    // should have two messages now
    const messagesAfter = await messageRepository.find();
    expect(messagesAfter).toHaveLength(2);
  });

  it('/message (POST) should reject invalid requests', async () => {
    const invalidEmailResponse = await request(app.getHttpServer())
      .post('/message')
      .send({
        name: 'satoshi',
        email: 'invalid_email',
        company: 'bitcoin ltd',
        message: 'plz where are my keys',
      })
      .expect(400);

    expect(invalidEmailResponse.body.message).toHaveLength(1);
    expect(invalidEmailResponse.body.message).toContain(
      'email must be an email',
    );

    const shortMessageResponse = await request(app.getHttpServer())
      .post('/message')
      .send({
        name: 'satoshi',
        email: 'satoshi@bitcoin.com',
        company: 'bitcoin ltd',
        message: 'too short',
      })
      .expect(400);

    expect(shortMessageResponse.body.message).toHaveLength(1);
    expect(shortMessageResponse.body.message).toContain(
      'message must be longer than or equal to 15 characters',
    );

    const missingNameResponse = await request(app.getHttpServer())
      .post('/message')
      .send({
        email: 'satoshi@bitcoin.com',
        company: 'bitcoin ltd',
        message: 'plz where are my keys',
      })
      .expect(400);

    expect(missingNameResponse.body.message).toHaveLength(1);
    expect(missingNameResponse.body.message).toContain(
      'name must be longer than or equal to 1 characters',
    );

    const noDataResponse = await request(app.getHttpServer())
      .post('/message')
      .send({})
      .expect(400);

    expect(noDataResponse.body.message).toHaveLength(3);
  });

  /**
   * READ
   */

  it('/message (GET) should return all messages', async () => {
    const response = await request(app.getHttpServer())
      .get('/message')
      .expect(200);

    // should return the two messages we seeded
    expect(response.body).toHaveLength(2);
    // notes should not be attached
    expect(response.body.notes).toBe(undefined);
  });

  it('/message:id (GET) should return specific message including all notes', async () => {
    const response = await request(app.getHttpServer())
      .get('/message/' + message1.id)
      .expect(200);

    expect(response.body.name).toEqual(message1.name);
    expect(response.body.notes).toHaveLength(2);
  });
});
