import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfig from './config/db.config';
import { MessageModule } from './message/message.module';
import { NoteModule } from './note/note.module';

const getEnvFilePath = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return '.dev.env';
    case 'testing':
      return '.test.env';
    case 'production':
      return '.prod.env';
    default:
      console.log('no NODE_ENV set.... exiting!');
      process.exit();
  }
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      load: [dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const databaseConfig = await configService.get('database');
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
