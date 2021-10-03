import { NextFunction, Request, Response } from 'express'
import { TDBMDataShopConfig } from '../types'
import ShopService from '../services/ShopService'
import logger from '../utils/logger'

class ShopController {
  public async getConfig(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TDBMDataShopConfig | null> | void> {
    try {
      const data = await ShopService.getConfigOrNull()
      return res.json(data)
    } catch (error) {
      next(logger.error(error, 'ProductController.getOneOrNull occurred error'))
    }
  }
}

export default new ShopController()
