import { QueryResult } from 'pg'
import { TDBMDataShopConfig, TShopControllerGetSlider } from '../types'
import logger from '../utils/logger'
import db from '../db/db'

class ShopService {
  public async getConfig(): Promise<QueryResult<TDBMDataShopConfig>[] | null> {
    try {
      const data = await db.query(`select *
                                   from shop_config`)
      if (data.rows.length === 0) return null
      return data.rows[0]
    } catch (error) {
      throw logger.error(error, 'ShopService.getConfig occurred error')
    }
  }

  public async getSlider(): Promise<
    QueryResult<TShopControllerGetSlider>[] | null
  > {
    try {
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
    } catch (error) {
      throw logger.error(error, 'ShopService.getSlider occurred error')
    }
  }
}

export default new ShopService()
