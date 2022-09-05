import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MessageModule } from '../src/message/message.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../src/message/entities/message.entity';
import { Repository } from 'typeorm';

describe('MessageController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Message>;

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
          entities: [Message],
          synchronize: true,
        }),
        MessageModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    repository = app.get('MessageRepository');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await repository.query('DELETE FROM message;');
  });

  /**
   * CREATE
   */
  it('/message (POST) should save a new message', async () => {
    // message table should be empty
    const messagesBefore = await repository.find();
    expect(messagesBefore).toHaveLength(0);

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

    // should have one message now
    const messagesAfter = await repository.find();
    expect(messagesAfter).toHaveLength(1);
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
    await repository.save([
      {
        name: 'Mr Satoshi',
        email: 'satoshi@bitcoin.com',
        company: 'Bitcoin ltd',
        message: "Hey guys i'm not dead can you help me find my keys plz",
      },
      {
        name: 'Charles',
        email: 'charles@cardano.com',
        company: 'Cardano',
        message: 'Hi frens can I interest you in some ADA',
      },
    ]);

    const response = await request(app.getHttpServer())
      .get('/message')
      .expect(200);

    expect(response.body).toHaveLength(2);
  });
});
