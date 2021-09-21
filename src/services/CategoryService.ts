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
      (
        SELECT COUNT(*) FROM categories cc, products pp, category_to_product cp
        where
        cc.url=$1
        and
        cc.id=cp.category_id
        and
        pp.id=cp.product_id
      ) 
      as count,
      pp.name as name,
      pp.productid as id,
      pp.price as price,
      pp.oldprice as oldprice,
      im.name as img
      from
      categories cc, products pp, category_to_product cp, images im
      where
      cc.url=$1
      and
      cc.id=cp.category_id
      and
      pp.id=cp.product_id
      and 
      im.product_id=pp.id
      and 
      im.preview=true
      group by pp.id, im.name limit $2 offset $3
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
