import { NextFunction, Request, Response } from 'express'
import CategoryService from '../services/CategoryService'
import {
  TGetBreadcrumb,
  TGetInfoByLevel,
  TGetProductFilter,
  TProductsByCategoryData,
} from '../types'
import logger from '../utils/logger'

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
        type: 'custom' | 'common' | 'all'
      }
      const offset: string = ((Number(page) - 1) * Number(limit)).toString()
      let data = null

      if (type === 'common') {
        data = await CategoryService.getProductsById({
          name,
          limit,
          offset,
        })
      } else if (type === 'custom') {
        data = await CategoryService.getCustomProductsById({
          name,
          limit,
          offset,
        })
      } else if (type === 'all') {
        const filter: TGetProductFilter = {
          price: { min: '800', max: '1000' },
        }
        data = await CategoryService.getAllProducts({
          limit,
          offset,
          filter,
        })
      }

      return res.status(200).json(data)
    } catch (error) {
      next(
        logger.error(
          error,
          'CategoryController.getCategoryProducts occurred error'
        )
      )
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
      next(
        logger.error(
          error,
          'CategoryController.getCategoryInfoByLevel occurred error'
        )
      )
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
      next(
        logger.error(
          error,
          'CategoryController.getCategoryBreadcrumb occurred error'
        )
      )
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
      next(
        logger.error(
          error,
          'CategoryController.getCustomProductsInfo occurred error'
        )
      )
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
      next(
        logger.error(
          error,
          'CategoryController.getAllProductsInfo occurred error'
        )
      )
    }
  }
}

export default new CategoryController()
