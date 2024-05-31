import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { KnexService } from 'src/knex/knex.service';
import { JwtUser } from 'src/user/interfaces/jwt-user.interface';
import { knexProcedure, knexRaw } from 'src/common/util/knex-raw';
import { getFullDateTime, getYMD } from 'src/common/util/date';
import { AlreadyOrderedDto } from 'src/modules/menu/common/add-order/dto/already-ordered.dto';
import { CreateOrderDto } from 'src/modules/menu/common/add-order/dto/create-order.dto';
import { ModifyOrderDto } from 'src/modules/menu/common/add-order/dto/modify-order.dto';
import { AddOrderSql } from 'src/modules/menu/common/add-order/sql/add-order.sql';
import { MysqlService } from 'src/mysql/mysql.service';
import { RowDataPacket } from 'mysql2';

interface OrderTimes extends RowDataPacket { order_time1: string, order_time2: string }

@Injectable()
export class AddOrderService {
  constructor(private knexService: KnexService, private mysqlService: MysqlService) {}

  /**
   * 이미 진행했던 주문 정보를 가져옵니다.
   *
   * @param user 유저 정보
   * @param alreadyOrderedDto
   */
  async getAlreadyOrdered(user: JwtUser, alreadyOrderedDto: AlreadyOrderedDto) {
    const conn = await this.mysqlService.getConnection(user);
    let { cus } = alreadyOrderedDto;
    const { code } = alreadyOrderedDto;
    cus = user.admin_gbn === '9' ? user.b2b_cus : cus;
    return conn.query(
      AddOrderSql.getAlreadyOrdered,
      [user.corp, cus, code]
    );
  }

  /**
   * 새 주문을 만듭니다.
   *
   * @param user 유저 정보
   * @param createOrderDto
   */
  async createOrder(user: JwtUser, createOrderDto: CreateOrderDto) {
    const conn = await this.mysqlService.getConnection(user);

    let { cus } = createOrderDto;
    const { orderList, jugyo } = createOrderDto;
    const corp = user.corp;
    const sqlGetCode = `CALL usp_seq_maker(?, 'SAL020', ?, @newseq); SELECT @newseq as newSeq`;
    const sqlMakeOrder = `CALL usp_order_maker(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    let canOrder = false;

    const orderTimes = await conn.queryLimitOne<OrderTimes>(
      `SELECT order_time1, order_time2 FROM acc010 WHERE corp = ? LIMIT 1`,
      [user.corp]
    )

    let { order_time1: orderStart, order_time2: orderEnd } = orderTimes;

    cus = user.admin_gbn === '9' ? user.b2b_cus : cus;

    const now = new Date();
    const currentTime = getFullDateTime().slice(0, 12);

    if(parseInt(orderStart) < parseInt(orderEnd)) {
      orderStart = getYMD() + orderStart;
      orderEnd = getYMD() + orderEnd;
    } else {
      orderStart = getYMD() + orderStart;
      now.setDate(now.getDate() + 1);
      orderEnd = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}${orderEnd}`
    }

    const orderStartInt = parseInt(orderStart);
    const orderEndInt = parseInt(orderEnd);
    const currentTimeInt = parseInt(currentTime);

    if(orderStartInt < currentTimeInt && currentTimeInt < orderEndInt) {
      canOrder = true;
    }

    if(canOrder) {
      await conn.transaction(async (trx) => {
        let newCode: string = (await trx.procedure<any>(sqlGetCode, [corp, getYMD()])).newSeq;
        newCode = getYMD().slice(2) + ('0000' + newCode).slice(-4);

        for(let i = 0; i < orderList.length; i++) {
          await trx.procedure(
            sqlMakeOrder,
            [corp, cus, newCode, i + 1, getYMD(), orderList[i].item, orderList[i].itemNm, orderList[i].qty, jugyo, user.user_nm, getFullDateTime()],
            true
          );
        }
      });

      return "주문을 성공적으로 완료하였습니다.";
    }

    throw new HttpException('주문가능 시간이 아닙니다.', HttpStatus.BAD_REQUEST);
  }

  /**
   * 이미 존재하는 주문을 수정합니다.
   * 새로 추가된 주문, 변경된 주문, 기존 내용에서 삭제된 주문을 따로 처리합니다.
   *
   * @param user 유저 정보
   * @param modifyOrderDto
   */
  async modifyOrder(user: JwtUser, modifyOrderDto: ModifyOrderDto) {
    const knex = await this.knexService.getConnection(user);
    let { cus } = modifyOrderDto;
    const { orderList, jugyo, code } = modifyOrderDto;
    cus = user.admin_gbn === '9' ? user.b2b_cus : cus;

    const originalOrderData = await knex
      .select(['a.item', 'b.item_usr', 'b.item_nm', 'qty', 'pri', 'amt', 'vat', 'a.vat_gbn', 'in_gbn', 'a.mk', 'a.mk_time'])
      .from('sal021 AS a')
      .innerJoin(knex.raw('sys020 AS b on a.corp = b.corp AND a.item = b.item'))
      .where('a.corp', user.corp)
      .andWhere('a.code', code);
    const newOrderList = orderList;
    const addedOrderList: any[] = [], modifiedOrderList: any[] = [], deletedOrderList: any[] = [];

    for(const newOrder of newOrderList) {
      const originalPri = originalOrderData.find((originalOrder) => originalOrder.item === newOrder.item);

      // 기존 주문에서 변경된 주문
      if(originalPri !== undefined && parseInt(newOrder.qty) !== 0 && parseInt(newOrder.qty) !== parseInt(originalPri.qty)) {
        modifiedOrderList.push({ ...newOrder, pri: originalPri.pri });
      }

      // 새로 생성된 주문
      if(!(originalOrderData.some((originalOrder) => originalOrder.item === newOrder.item)) && parseInt(newOrder.qty) !== 0) {
        addedOrderList.push(newOrder);
      }

      // 삭제된 주문
      if(originalOrderData.some((originalOrder) => originalOrder.item === newOrder.item) && parseInt(newOrder.qty) === 0) {
        deletedOrderList.push(newOrder);
      }
    }

    await knex.transaction(async (trx) => {
      const updatedTime = getFullDateTime();

      // 기존에서 바뀐 정보 적용
      for(const modified of modifiedOrderList) {
        const qty = parseFloat(modified.qty), pri = parseFloat(modified.pri);
        const totalPri = qty * pri;
        const updateExistingOrderBindings =
          [qty, pri, totalPri, totalPri, totalPri, user.user_nm, updatedTime, jugyo, user.corp, code, modified.item];
        await knexRaw(
          trx,
          AddOrderSql.updateExistingOrder,
          updateExistingOrderBindings
        );
      }

      const metadata = await trx('sal021')
        .select<{ cnt: number, mk: string, mk_time: string }[]>(knex.raw('COUNT(*) AS cnt, mk, mk_time'))
        .where('corp', user.corp).andWhere('code', code).first();
      let seq = metadata.cnt;
      const mk = metadata.mk, mkTime = metadata.mk_time;

      // 추가된 품목 적용
      for(const addedOrder of addedOrderList) {
        seq += 1;
        const item = addedOrder.item, qty = addedOrder.qty, ymd = '20' + code.slice(0, 6);

        const outPri = (await trx('sys060').select('out_pri')
          .where('corp', user.corp).andWhere('ymd', '<=', ymd)
          .orderBy('ymd', 'desc').limit(1).first()).out_pri;
        const vatGbnResult = (await trx('sys020').select('vat_gbn')
          .where('corp', user.corp).andWhere('item', item).first());
        const vatGbn = vatGbnResult === undefined ? '11' : '1' + vatGbnResult.vat_gbn;

        const pri = parseFloat(outPri);
        const amt = vatGbn === '11' ? qty * pri : Math.round(qty * pri * (10 / 11));
        const vat = vatGbn === '13' ? 0 : Math.round(qty * pri * (1 / 11));

        await knexRaw(
          trx,
          AddOrderSql.insertAddedOrder,
          [user.corp, code, seq, '20' + code.slice(0, 6),
            cus, item, qty, pri, amt, vat, vatGbnResult, jugyo,
            mk, mkTime, user.user_nm, updatedTime]
        );
      }

      // 삭제된 주문 적용
      for(const deleted of deletedOrderList) {
        await knexRaw(trx, 'DELETE FROM sal021 WHERE corp=? AND code=? AND item=?', [user.corp, code, deleted.item]);
      }
    });

    return "주문을 성공적으로 수정하였습니다.";
  }

  /**
   * 주문을 삭제합니다.
   *
   * @param user
   * @param code
   */
  async deleteOrder(user: JwtUser, code: string) {
    const knex = await this.knexService.getConnection(user);

    await knex.transaction(async (trx) => {
      await trx('sal021')
        .where('corp', user.corp)
        .andWhere('code', code)
        .del();
    });

    return "주문을 성공적으로 삭제하였습니다.";
  }
}