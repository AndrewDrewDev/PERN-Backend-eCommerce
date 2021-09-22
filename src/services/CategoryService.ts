import { TProductsByCategoryData, TgetProductsByCategory } from '../types'
import { QueryResult } from 'pg'
import db from '../db/db'
import logger from '../utils/logger'

class CategoryService {
  public async getProductsByCategory({
    name,
    limit,
    offset,
  }: TgetProductsByCategory): Promise<
    QueryResult<TProductsByCategoryData>[] | null
  > {
    try {
      const data = await db.query(
        `
        select
          pp.name as name,
          pp.productid as id,
          pp.price as price,
          pp.oldprice as oldprice,
          lb.name as label,
          im.name as img
        from
          products pp
        left join
          category_to_product cp
          on
          pp.id=cp.product_id
        left join
          categories cc
        on
          cc.url=$1
          and
          cc.id=cp.category_id
        left join
          labels lb
          on
          lb.id=pp.label_id
        left join
          images im
          on
          im.product_id=pp.id
          and
          im.preview=true
        where
          cc.url=$1
          and
          cc.id=cp.category_id
          and
          pp.id=cp.product_id
        group by pp.id, im.name, lb.name limit $2 offset $3
      `,
        [name, limit, offset]
      )
      if (data.rows.length === 0) return null
      return data.rows
    } catch (error) {
      throw logger.error(error, 'getProductsByCategory occurred error')
    }
  }
}

export default new CategoryService()
