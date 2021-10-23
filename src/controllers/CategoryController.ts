import { NextFunction, Request, Response } from 'express'
import CategoryService from '../services/CategoryService'
import {
  TGetBreadcrumb,
  TGetInfoByLevel,
  TProductsByCategoryData,
} from '../types'
import ErrorHandler from '../error/ErrorHandler'

class CategoryController {
  public async getProductsById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TProductsByCategoryData[] | null> | void> {
    try {
      let { name, page, limit, type } = req.query as {
        name: string
        page: string
        limit: string
        type: 'custom' | 'common' | 'label' | 'all'
      }
      const offset: string = ((Number(page) - 1) * Number(limit)).toString()
      let data = null

      if (type === 'common') {
        data = await CategoryService.getProductsById({
          categoryUrl: name,
          limit,
          offset,
        })
      } else if (type === 'custom') {
        data = await CategoryService.getCustomProductsById({
          categoryUrl: name,
          limit,
          offset,
        })
      } else if (type === 'label') {
        data = await CategoryService.getLabelProductsById({
          labelUrl: name,
          limit,
          offset,
        })
      } else if (type === 'all') {
        data = await CategoryService.getAllProducts({
          limit,
          offset,
        })
      } else {
        return res.status(400).json({ message: 'Wrong type!' })
      }

      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async getInfoByLevel(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TGetInfoByLevel[] | null> | void> {
    try {
      const { level } = req.params
      const data = await CategoryService.getInfoByLevel(level)
      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async getBreadcrumb(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TGetBreadcrumb[] | null> | void> {
    try {
      const { url } = req.params
      const data = await CategoryService.getBreadcrumb(url)
      return res.json(data)
    } catch (error) {
      next(next(new ErrorHandler(500, error.message)))
    }
  }

  public async getCustomProductsInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TGetInfoByLevel[] | null> | void> {
    try {
      const { id } = req.params
      const data = await CategoryService.getCustomCategoryInfo(id)
      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }
  public async getAllProductsInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TGetInfoByLevel[] | null> | void> {
    try {
      const data = await CategoryService.getAllCategoryInfo()
      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }
}

export default new CategoryController()
