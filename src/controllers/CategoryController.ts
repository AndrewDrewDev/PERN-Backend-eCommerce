import { NextFunction, Request, Response } from 'express'
import CategoryService from '../services/CategoryService'
import {
  TGetBreadcrumb,
  TGetInfoByLevel,
  TProductsByCategoryData,
} from '../types'
import logger from '../utils/logger'

class CategoryController {
  public async getCategoryProductsOrNull(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TProductsByCategoryData[] | null> | void> {
    try {
      let { name, page, limit } = req.query as {
        name: string
        page: string
        limit: string
      }
      const offset: string = ((Number(page) - 1) * Number(limit)).toString()
      const data = await CategoryService.getProductsByCategoryOrNull({
        name,
        limit,
        offset,
      })
      return res.json(data)
    } catch (error) {
      next(
        logger.error(
          error,
          'CategoryController.getCategoryProductsOrNull occurred error'
        )
      )
    }
  }

  public async getCategoryInfoByLevelOrNull(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TGetInfoByLevel[] | null> | void> {
    try {
      const { level } = req.params
      const data = await CategoryService.getInfoByLevelOrNull(level)
      return res.json(data)
    } catch (error) {
      next(
        logger.error(
          error,
          'CategoryController.getCategoryInfoByLevelOrNull occurred error'
        )
      )
    }
  }

  public async getCategoryBreadcrumbOrNull(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TGetBreadcrumb[] | null> | void> {
    try {
      const { url } = req.params
      const data = await CategoryService.getBreadcrumbOrNull(url)
      return res.json(data)
    } catch (error) {
      next(
        logger.error(
          error,
          'CategoryController.getCategoryBreadcrumbOrNull occurred error'
        )
      )
    }
  }

  public async getCustomCategoryOrNull(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TProductsByCategoryData[] | null> | void> {
    try {
      let { name, page, limit } = req.query as {
        name: string
        page: string
        limit: string
      }
      const offset: string = ((Number(page) - 1) * Number(limit)).toString()
      const data = await CategoryService.getCustomCategoryByUrlOrNull({
        name,
        limit,
        offset,
      })
      return res.json(data)
    } catch (error) {
      next(
        logger.error(
          error,
          'CategoryController.getCustomCategoryOrNull occurred error'
        )
      )
    }
  }
}

export default new CategoryController()
