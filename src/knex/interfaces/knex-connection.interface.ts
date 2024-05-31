import { Knex } from 'knex';

/**
 * knex 커넥션을 저장할 객체의 인터페이스 입니다.
 */
export interface KnexConnection {
  [key: string]: Knex;
}