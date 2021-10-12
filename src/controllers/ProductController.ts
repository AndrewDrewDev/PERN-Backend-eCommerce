import { NextFunction, Request, Response } from 'express'
import { TCProductGetOneResult } from '../types'
import ProductService from '../services/ProductService'
import logger from '../utils/logger'

class ProductController {
  public async getOneById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCProductGetOneResult | null> | void> {
    try {
      const result: TCProductGetOneResult = {} as any
      const { id } = req.params
      const data = await ProductService.getOneById(id)

      return res.status(200).json(data)
    } catch (error) {
      next(logger.error(error, 'ProductController.getOneById occurred error'))
    }
  }
}

export default new ProductController()
