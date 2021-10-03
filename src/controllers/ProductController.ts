import { NextFunction, Request, Response } from 'express'
import { TCProductGetOneResult } from '../types'
import ProductService from '../services/ProductService'
import logger from '../utils/logger'

class ProductController {
  public async getOneOrNull(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCProductGetOneResult | null> | void> {
    try {
      const result: TCProductGetOneResult = {} as any
      const { id } = req.params
      const data = await ProductService.getOneProductDbOrNull(id)

      // Preparation & Combine data
      result.categories = []
      result.images = { preview: '', big: [] }
      const temp: string[] = []
      for (const item of data.rows) {
        if (!temp.includes(item.categoryname)) {
          result.categories.push({
            name: item.categoryname,
            url: item.categoryurl,
          })
          temp.push(item.categoryname)
        }

        if (!temp.includes(item.image)) {
          if (item.ispreview) {
            result.images.preview = item.image
          } else {
            result.images.big.push(item.image)
          }

          temp.push(item.image)
        }

        result.name = item.name
        result.label = item.label
        result.unit = item.unit
        result.supplier = item.supplier
        result.id = item.id
        result.vendorId = item.vendorid
        result.description = item.description
        result.price = item.price
        result.oldPrice = item.oldprice
        result.amount = item.amount
        result.status = item.status
        result.images.big.reverse()
      }

      // Check if product not founded in db
      if (!result.name) return res.json(null)
      return res.json(result)
    } catch (error) {
      next(logger.error(error, 'ProductController.getOneOrNull occurred error'))
    }
  }
}

export default new ProductController()
