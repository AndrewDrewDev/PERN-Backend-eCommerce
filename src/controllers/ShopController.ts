import { NextFunction, Request, Response } from 'express'
import { TDBMDataShopConfig, TShopControllerGetSlider } from '../types'
import ShopService from '../services/ShopService'
import logger from '../utils/logger'

class ShopController {
  public async getConfigOrNull(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TDBMDataShopConfig | null> | void> {
    try {
      const data = await ShopService.getConfig()
      return res.status(200).json(data)
    } catch (error) {
      next(logger.error(error, 'ShopController.getConfigOrNull occurred error'))
    }
  }

  public async getSliderOrNull(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TShopControllerGetSlider[] | null> | void> {
    try {
      const data = await ShopService.getSlider()
      return res.status(200).json(data)
    } catch (error) {
      next(logger.error(error, 'ShopController.getSliderOrNull occurred error'))
    }
  }
}

export default new ShopController()
