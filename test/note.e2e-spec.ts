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
  let messageRepository: Repository<Message>;
  let message1: Message;
  let message2: Message;

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
    messageRepository = app.get('MessageRepository');

    await app.init();
  });

  beforeAll(async () => {
    await messageRepository.query('DELETE FROM message;');

    const message1Data = messageRepository.create({
      name: 'satoshi',
      email: 'satoshi@bitcoin.com',
      company: 'bitcoin ltd',
      message: 'plz where are my keys',
    });
    message1 = await messageRepository.save(message1Data);

    const message2Data = messageRepository.create({
      name: 'Vitalik',
      email: 'vitalik@ethereum.com',
      company: 'ethereum ltd',
      message: 'proof of stake is great (buy my book)',
    });
    message2 = await messageRepository.save(message2Data);
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * CREATE
   */
  it('/note (POST) should save a new note', async () => {
    const message1Before = await messageRepository.findOne({
      where: { id: message1.id },
      relations: ['notes'],
    });
    expect(message1Before.notes).toHaveLength(0);

    // add 2 notes to message1
    await request(app.getHttpServer())
      .post('/note')
      .send({
        messageId: message1.id,
        content: 'first note - im attached to message1',
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/note')
      .send({
        messageId: message1.id,
        content: 'second note - im attached to message1',
      })
      .expect(201);

    // add one note to message2
    await request(app.getHttpServer())
      .post('/note')
      .send({
        messageId: message2.id,
        content: 'im attached to message2',
      })
      .expect(201);

    const message1After = await messageRepository.findOne({
      where: { id: message1.id },
      relations: ['notes'],
    });
    expect(message1After.notes).toHaveLength(2);

    const message2After = await messageRepository.findOne({
      where: { id: message2.id },
      relations: ['notes'],
    });
    expect(message2After.notes).toHaveLength(1);
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

    const invalidMessageIdResponse = await request(app.getHttpServer())
      .post('/note')
      .send({
        // this id won't be found
        messageId: '00000',
        content: 'floofy',
      })
      .expect(400);

    expect(invalidMessageIdResponse.body.message).toContain(
      'Message not found, cannot create note.',
    );
  });
});
