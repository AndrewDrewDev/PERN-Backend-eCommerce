import { QueryResult } from 'pg'
import { TCProductGetOneData } from '../types'
import db from '../db/db'
import logger from '../utils/logger'

class ProductService {
  public async getOneById(
    id: string
  ): Promise<QueryResult<TCProductGetOneData>> {
    try {
      return await db.query(
        `
      select
        im.name as image,
        im.preview as ispreview,
        cc.name as categoryname,
        cc.url as categoryurl,
        pp.name as name,
        lb.name as label,
        un.name as unit,
        su.name as supplier,
        pp.productId as id,
        pp.description as description,
        pp.price as price,
        pp.oldPrice as oldPrice,
        pp.amount as amount,
        pp.vendorid as vendorid,
        st.name as status
      from
        category_to_product cp
      left join
        categories cc
      on
        cc.id=cp.category_id
      left join
        products pp
      on
        pp.productId=$1
      left join
        labels lb
      on
        lb.id=pp.label_id
      left join
        units un
      on
        un.id=pp.units_id
      left join
        suppliers su
      on
       su.id=pp.supplier_id
      left join
        images im
      on
       im.product_id=pp.id
      left join
      statuses st
      on
      st.id=pp.id
      where
        cp.product_id=(select id from products pp where pp.productId=$1)
      ORDER BY
        cp.level ASC`,
        [id]
      )
    } catch (error) {
      throw logger.error(error, 'getOneProductDb occurred error')
    }
  }
}

export default new ProductService()
