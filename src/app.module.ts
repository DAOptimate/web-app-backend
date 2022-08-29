import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: 'password',
      database: 'daoptimate_dev_db',
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
    }),
    MessageModule,
  ],
})
export class AppModule {}
