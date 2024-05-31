import { registerAs } from '@nestjs/config';
import { Knex } from 'knex';

const knexAdminDbConfig = registerAs('knexAdminDbConfig', (): Knex.Config => ({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_ADMIN,
    user: process.env.USER_ADMIN,
    password: process.env.PWD_ADMIN,
  },
  pool: {
    min: 1,
    max: 10,
  }
}))

export const adminDbConfig = registerAs('adminDbConfig', () => ({
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_ADMIN,
  user: process.env.USER_ADMIN,
  password: process.env.PWD_ADMIN,
}));
export default knexAdminDbConfig;