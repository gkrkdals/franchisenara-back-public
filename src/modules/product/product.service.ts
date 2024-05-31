import { Injectable } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { Product } from 'src/model/product';
import { ProductCategory } from 'src/model/product-category';
import { MysqlService } from 'src/mysql/mysql.service';
import ProductSQL from 'src/modules/product/product.sql';

@Injectable()
export class ProductService {
  constructor(private mysqlService: MysqlService) {}

  /**
   * 유저 정보를 토대로 사용하는 제품을 구합니다.
   *
   * @param user 유저 정보
   */
  // TODO: console 제거 후 변수 인라인화
  async getProduct(@User() user: JwtUser): Promise<Product[]> {
    const conn = await this.mysqlService.getConnection(user);
    return conn.query<Product[]>(ProductSQL.getProduct, [user.corp, user.corp, user.corp])
  }

  /**
   * 유저 정보를 토대로 제품 카테고리를 구합니다.
   *
   * @param user 유저 정보
   */
  async getProductCategory(user: JwtUser): Promise<ProductCategory[]> {
    const conn = await this.mysqlService.getConnection(user);
    return conn.query<ProductCategory[]>('SELECT big, cd_nm FROM sys021 WHERE corp=? AND use_gbn=1', [user.corp])
  }
}