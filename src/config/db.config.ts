import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const config = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    entities: ['./dist/**/*entity.{ts,js}'],
    synchronize: process.env.NODE_ENV === 'development',
  };
  return config;
});
