import { QueryResult } from 'pg'
import { TDBMDataShopConfig, TShopControllerGetSlider } from '../types'
import db from '../db/db'

class ShopService {
  public async getConfig(): Promise<QueryResult<TDBMDataShopConfig>[] | null> {
    const data = await db.query(`select *
                                   from shop_config`)
    if (data.rows.length === 0) return null
    return data.rows[0]
  }

  public async getSlider(): Promise<
    QueryResult<TShopControllerGetSlider>[] | null
  > {
    const data = await db.query(
      `
            select sl.title,
                   sl.img
            from slider sl
            order by sl.order_index asc 
            `
    )

    if (data.rows.length === 0) return null
    return data.rows
  }
}

export default new ShopService()
