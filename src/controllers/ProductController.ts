import { NextFunction, Request, Response } from 'express'
import { TCProductFullInfo, TGetSearchProductsByName } from '../types'
import ProductService from '../services/ProductService'
import ErrorHandler from '../error/ErrorHandler'

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
      next(new ErrorHandler(500, error.message))
    }
  }

  public async updateOneById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCProductFullInfo> | void> {
    try {
      const { id } = req.params
      const updateData: TCProductFullInfo = req.body
      const updatedProduct = await ProductService.updateOneById(id, updateData)

      if (!updatedProduct) {
        return res.status(400).json({ message: 'Wrong data format.' })
      }

      return res.status(200).json(updatedProduct)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async getSearchByName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TGetSearchProductsByName[] | null> | void> {
    try {
      const { name } = req.params
      const data = await ProductService.getSearchProductsByName(name)

      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }
}

export default new ProductController()
