import { NextFunction, Request, Response } from 'express'
import { TCProductFullInfo, TGetSearchProductsByName } from '../types'
import ProductService from '../services/ProductService'
import logger from '../utils/logger'

class ProductController {
  public async getOneById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCProductFullInfo | null> | void> {
    try {
      const { id } = req.params
      const data = await ProductService.getOneById(id)

      return res.status(200).json(data)
    } catch (error) {
      next(logger.error(error, 'ProductController.getOneById occurred error'))
    }
  }

  public async getSearchProductsByName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TGetSearchProductsByName[] | null> | void> {
    try {
      const { name } = req.params
      const data = await ProductService.getSearchProductsByName(name)

      return res.status(200).json(data)
    } catch (error) {
      next(
        logger.error(
          error,
          'ProductController.getProductsByName occurred error'
        )
      )
    }
  }
}

export default new ProductController()
