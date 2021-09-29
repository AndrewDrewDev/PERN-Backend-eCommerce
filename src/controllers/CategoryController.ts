import { Request, Response } from 'express'
import CategoryService from '../services/CategoryService'
import {
  TGetBreadcrumb,
  TGetInfoByLevel,
  TProductsByCategoryData,
} from '../types'

class CategoryController {
  public async getCategoryProductsOrNull(
    req: Request,
    res: Response
  ): Promise<Response<TProductsByCategoryData[] | null>> {
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
  }

  public async getCategoryInfoByLevelOrNull(
    req: Request,
    res: Response
  ): Promise<Response<TGetInfoByLevel[] | null>> {
    const { level } = req.params
    const data = await CategoryService.getInfoByLevelOrNull(level)
    return res.json(data)
  }

  public async getCategoryBreadcrumbOrNull(
    req: Request,
    res: Response
  ): Promise<Response<TGetBreadcrumb[] | null>> {
    const { url } = req.params
    const data = await CategoryService.getBreadcrumbOrNull(url)
    return res.json(data)
  }

  public async getCustomCategoryOrNull(
    req: Request,
    res: Response
  ): Promise<Response<TProductsByCategoryData[] | null>> {
    const { url } = req.params
    const data = await CategoryService.getCustomCategoryByUrlOrNull(url)
    return res.json(data)
  }
}

export default new CategoryController()
