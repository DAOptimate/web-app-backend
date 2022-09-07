import { faker } from '@faker-js/faker';
import { Message } from '../../src/message/entities/message.entity';
import { DataSource } from 'typeorm';

export class SeederModule {
  private static dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3307,
    username: 'root',
    password: 'password',
    database: 'daoptimate_dev_db',
    entities: ['src/**/*.entity.ts'],
    synchronize: true,
  });

  public static async run() {
    await this.dataSource.initialize();
    // start with fresh DB (passing true here drops tables for registered entities before syncing)
    await this.dataSource.synchronize(true);

    const messageRepository = this.dataSource.getRepository(Message);

    const messageData = [...Array(15)].map(() =>
      messageRepository.create({
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        company: faker.company.name(),
        message: faker.lorem.sentences(2),
      }),
    );

    await Promise.all(
      messageData.map((message) => {
        return messageRepository.save(message);
      }),
    );
  }

  public static async clean() {
    await this.dataSource.initialize();
    await this.dataSource.synchronize(true);
  }
}
