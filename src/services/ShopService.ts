import { QueryResult } from 'pg'
import { TDBMDataShopConfig } from '../types'
import logger from '../utils/logger'
import db from '../db/db'

class ShopService {
  public async getConfig(): Promise<QueryResult<TDBMDataShopConfig>[]> {
    try {
      const data = await db.query(`select * from shop_config`)
      return data.rows
    } catch (error) {
      throw logger.error(error, 'ShopService.getConfig occurred error')
    }
  }
}

export default new ShopService()
