import { Request, Response } from 'express'
import CategoryService from '../services/CategoryService'
import { TGetInfoByLevel, TProductsByCategoryData } from '../types'

class CategoryController {
  public async getCategoryProducts(
    req: Request,
    res: Response
  ): Promise<Response<TProductsByCategoryData[] | null>> {
    let { name, page, limit } = req.query as {
      name: string
      page: string
      limit: string
    }
    const offset: string = ((Number(page) - 1) * Number(limit)).toString()
    const data = await CategoryService.getProductsByCategory({
      name,
      limit,
      offset,
    })
    return res.json(data)
  }

  public async getCategoryInfoByLevel(
    req: Request,
    res: Response
  ): Promise<Response<TGetInfoByLevel[] | null>> {
    const { level } = req.params
    const data = await CategoryService.getInfoByLevel(level)
    return res.json(data)
  }
}

export default new CategoryController()
