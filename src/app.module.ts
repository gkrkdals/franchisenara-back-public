import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import jwtConfig from 'src/config/jwt/configuration';
import knexAdminDbConfig, { adminDbConfig } from 'src/config/database/mysql/configuration';
import { KnexModule } from 'src/knex/knex.module';
import { MainApiModule } from 'src/modules/main-api.module';
import { MysqlModule } from 'src/mysql/mysql.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [adminDbConfig, knexAdminDbConfig, jwtConfig]
    }),
    AuthModule,
    KnexModule,
    MysqlModule,
    MainApiModule,
  ],
})
export class AppModule {}
