import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MessageModule } from '../src/message/message.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../src/message/entities/message.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;

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
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  //   it('/message (GET) should return all messages', async () => {
  //     const response = await request(app.getHttpServer())
  //       .get('/message')
  //       .expect(200);

  //      expect(response.body).toHaveLength(0);
  //   });

  it('/message (POST) should return 400 if request is invalid', async () => {
    const response = await request(app.getHttpServer())
      .post('/message')
      .send()
      .expect(400);
  });
});
