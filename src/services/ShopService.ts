import { QueryResult } from 'pg'
import { TDBMDataShopConfig } from '../types'
import logger from '../utils/logger'
import db from '../db/db'

class ShopService {
  public async getConfigOrNull(): Promise<
    QueryResult<TDBMDataShopConfig>[] | null
  > {
    try {
      const data = await db.query(`select * from shop_config`)
      if (data.rows.length === 0) return null
      return data.rows[0]
    } catch (error) {
      throw logger.error(error, 'ShopService.getConfig occurred error')
    }
  }
}

export default new ShopService()
