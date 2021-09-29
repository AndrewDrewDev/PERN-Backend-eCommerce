import {
  TProductsByCategoryData,
  TGetProductsByCategory,
  TGetInfoByLevel,
  TGetBreadcrumb,
} from '../types'
import { QueryResult } from 'pg'
import db from '../db/db'
import logger from '../utils/logger'
import { callbackify } from 'util'

class CategoryService {
  public async getProductsByCategoryOrNull({
    name,
    limit,
    offset,
  }: TGetProductsByCategory): Promise<
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
      throw logger.error(error, 'getProductsByCategoryOrNull occurred error')
    }
  }

  public async getInfoByLevelOrNull(
    level: string
  ): Promise<QueryResult<TGetInfoByLevel>[] | null> {
    try {
      const result = await db.query(
        `
      select count(pp) as count, cc.name, cc.url from categories cc
        left join category_to_product cp on cp.category_id=cc.id and cp.level=$1
        left join products pp on cp.product_id=pp.id
      where 
      cp.level is not null
      group by cc.name, cc.url, cp.level    
      `,
        [level]
      )

      if (result.rows.length === 0) return null
      return result.rows
    } catch (error) {
      throw logger.error(error, 'getInfoByLevelOrNull occurred error')
    }
  }

  public async getBreadcrumbOrNull(
    categoryUrl: string
  ): Promise<TGetBreadcrumb[] | null> {
    try {
      const data: QueryResult<TGetBreadcrumb> = await db.query(
        `
      with recursive tree(id, name, url , parentid) as (
      select n.id, n.name, n.url, n.parentid
      from categories n
      where n.url = $1
      union all
      select n.id, n.name, n.url, n.parentid
      from categories n
      join tree t on (n.id = t.parentid)
      )
      select *
      from tree t ORDER BY t.parentid ASC nulls FIRST`,
        [categoryUrl]
      )

      if (data.rows.length === 0) return null

      return data.rows.map(i => {
        return { name: i.name, url: i.url }
      })
    } catch (error) {
      throw logger.error(error, 'getBreadcrumbOrNull occurred error')
    }
  }

  public getCustomCategoryByUrlOrNull(url: string): any {
    try {
      return '12312'
    } catch (error) {
      throw logger.error(error, 'getCustomCategoryByUrlOrNull occurred error')
    }
  }
}

export default new CategoryService()
