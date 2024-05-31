import { Knex } from 'knex';

/**
 * knex.raw를 간소화합니다.
 *
 * @param knex Knex 인스턴스
 * @param sql sql 스트링
 * @param bindings 바인딩
 */
export async function knexRaw<T>(
  knex: Knex<any, any[]>,
  sql: string,
  bindings?: any[]) {
  return (await knex.raw<T[]>(sql, bindings)).at(0);
}

export async function knexProcedure<T>(
  knex: Knex<any, any[]>,
  sql: string,
  bindings?: any[], noreturn?: boolean) {
  if(noreturn) {
    await knex.raw<T[]>(sql, bindings);
  } else {
    return (await knex.raw<T[]>(sql, bindings))[0][1][0];
  }
}