import { Request, Response } from 'express'
import CategoryService from '../services/CategoryService'
import { TProductsByCategoryData } from '../types'

type LLL = {
  name: string
  page: number
  limit: number
  offset: number
}

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
}

export default new CategoryController()
