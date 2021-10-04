import { NextFunction, Request, Response } from 'express'
import CategoryService from '../services/CategoryService'
import {
  TGetBreadcrumb,
  TGetInfoByLevel,
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
      return res.status(200).json(data)
    } catch (error) {
      next(
        logger.error(
          error,
          'CategoryController.getCategoryProductsOrNull occurred error'
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
      const data = await CategoryService.getInfoByLevelOrNull(level)
      return res.status(200).json(data)
    } catch (error) {
      next(
        logger.error(
          error,
          'CategoryController.getCategoryInfoByLevelOrNull occurred error'
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

  public async getCustomProductsById(
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
      return res.status(200).json(data)
    } catch (error) {
      next(
        logger.error(
          error,
          'CategoryController.getCustomCategoryOrNull occurred error'
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
      const data = await CategoryService.getCustomCategoryInfoOrNull(id)
      return res.status(200).json(data)
    } catch (error) {
      next(
        logger.error(
          error,
          'CategoryController.getCustomCategoryInfoOrNull occurred error'
        )
      )
    }
  }
}

export default new CategoryController()
