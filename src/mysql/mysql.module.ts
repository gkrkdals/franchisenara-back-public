import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MysqlService } from 'src/mysql/mysql.service';

@Module({
  imports: [ConfigModule],
  providers: [MysqlService]
})
export class MysqlModule {}