import { Injectable } from '@nestjs/common';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { getYMD } from 'src/common/util/date';
import { Product } from 'src/model/product';
import { Favorite } from 'src/model/add-order/favorite';
import { ModifyFavoriteDto } from 'src/modules/menu/common/add-order/dto/modify-favorite.dto';
import { MysqlService } from 'src/mysql/mysql.service';
import { ProductSql } from 'src/modules/menu/common/add-order/sql/product.sql';

@Injectable()
export class ProductService {
  constructor(private mysqlService: MysqlService) {}

  async getOrderProduct(user: JwtUser, cus: string) {
    const conn = await this.mysqlService.getConnection(user);
    cus = user.admin_gbn === '9' ? user.b2b_cus : cus;
    const corp = user.corp;

    return conn.query(ProductSql.getProduct, [getYMD(), cus, corp, corp, corp]);
  }

  async getFavoriteProduct(user: JwtUser, cus: string): Promise<Product[]> {
    const conn = await this.mysqlService.getConnection(user);
    cus = user.admin_gbn === '9' ? user.b2b_cus : cus;

    return conn.query<Product[]>(ProductSql.getFavoriteProducts, [getYMD(), user.corp, cus])
  }

  async modifyFavoriteProduct(user: JwtUser, modifyFavoriteDto: ModifyFavoriteDto) {
    const conn = await this.mysqlService.getConnection(user);
    let { cus } = modifyFavoriteDto;
    cus = user.admin_gbn === '9' ? user.b2b_cus : cus;

    const currentFavorites = await conn.query<Favorite[]>(
      ProductSql.getCurrentFavorites,
      [user.corp, cus]
    );

    const { newFavorites } = modifyFavoriteDto;
    const deletedFavorites: Favorite[] = [], addedFavorites: Favorite[] = [];

    for(const currentFavorite of currentFavorites) {
      if(newFavorites.every(element => element.item != currentFavorite.item)) {
        deletedFavorites.push(currentFavorite);
      }
    }

    for(const newFavorite of newFavorites) {
      if(currentFavorites.every(element => element.item !== newFavorite.item)) {
        addedFavorites.push(newFavorite);
      }
    }

    await conn.transaction(async (trx) => {
      for(const addedFavorite of addedFavorites) {
        await trx.execute(ProductSql.addFavorite, [user.corp, cus, addedFavorite.item]);
      }

      for(const deletedFavorite of deletedFavorites) {
        await trx.execute(ProductSql.deleteFavorite, [user.corp, cus, deletedFavorite.item]);
      }
    });
  }
}