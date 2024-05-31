import { Connection, ConnectionOptions, createConnection } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import { InternalServerErrorException } from '@nestjs/common';

export class Transaction {
  protected readonly connection: Promise<Connection>;

  async query<T extends RowDataPacket[]>(sql: string, bindings?: any[]): Promise<T> {
    return (await (await this.connection).query<T>(sql, bindings))[0];
  }

  constructor(config: ConnectionOptions) {
    this.connection = createConnection(config);
  }

  async beginTransaction(): Promise<void> {
    await (await this.connection).beginTransaction();
  }

  async commit(): Promise<void> {
    await (await this.connection).commit();
  }

  async rollback(): Promise<void> {
    await (await this.connection).rollback();
  }

  async procedure<T extends RowDataPacket>(sql: string, bindings?: any[], noreturn?: boolean) {
    if(noreturn) {
      await this.query(sql, bindings);
    } else {
      return (await this.query<T[]>(sql, bindings))[1][0];
    }
  }

  async execute(sql: string, bindings?: any[]): Promise<void> {
    await (await this.connection).execute(sql, bindings);
  }
}

export default class Mysql extends Transaction {
  async queryLimitOne<T extends RowDataPacket>(sql: string, bindings?: any[]): Promise<T> {
    return (await this.query<T[]>(sql, bindings))[0];
  }

  async countQuery(sql: string, bindings?: any[]): Promise<number | undefined> {
    return Object.values((await this.queryLimitOne<any>(sql, bindings))).at(0) as number;
  }

  async transaction(callback: (conn: Transaction) => Promise<void>): Promise<void> {
    const transaction = new Transaction((await this.connection).config);

    try {
      await transaction.beginTransaction();
      await callback(transaction);
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw new InternalServerErrorException();
    }
  }
}