import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfig from './config/db.config';
import { MessageModule } from './message/message.module';
import { NoteModule } from './note/note.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.prod.env'
          : process.env.NODE_ENV === 'testing'
          ? '.test.env'
          : '.dev.env',
      load: [dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const databaseConfig = await configService.get('database');
        console.log({ databaseConfig });

        return {
          ...databaseConfig,
        };
      },
      inject: [ConfigService],
    }),
    MessageModule,
    NoteModule,
  ],
})
export class AppModule {}
