import { Module } from '@nestjs/common';
import { ProductController } from 'src/modules/product/product.controller';
import { ProductService } from 'src/modules/product/product.service';
import { JwtService } from '@nestjs/jwt';
import { MysqlService } from 'src/mysql/mysql.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, JwtService, MysqlService],
})
export class ProductModule {}