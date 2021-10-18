import { NextFunction, Request, Response } from 'express'
import { TDBMDataShopConfig, TShopControllerGetSlider } from '../types'
import ShopService from '../services/ShopService'
import ErrorHandler from '../error/ErrorHandler'

class ShopController {
  public async getConfig(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TDBMDataShopConfig | null> | void> {
    try {
      const data = await ShopService.getConfig()
      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async getSlider(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TShopControllerGetSlider[] | null> | void> {
    try {
      const data = await ShopService.getSlider()
      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }
}

export default new ShopController()
