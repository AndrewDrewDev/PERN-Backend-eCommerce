import { NextFunction, Request, Response } from 'express'
import CategoryService from '../model/CategoryModel'
import {
  TCMGetBreadcrumb,
  TCMGetInfoByLevel,
  TCMProductsByCategoryData,
  TCResponseMessage,
} from '../types'
import ErrorHandler from '../error/ErrorHandler'
import { UploadedFile } from 'express-fileupload'

class CategoryController {
  public async getProductsById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCMProductsByCategoryData[] | null> | void> {
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

  public async updateCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCResponseMessage> | void> {
    try {
      const { oldName, newName } = req.params
      const files = req.files

      if (!oldName && !newName) {
        return res.status(400).json({
          code: 400,
          status: 'FAILED',
          message: 'Request parameter or body not found!',
        })
      }

      // Extract img if exist
      let img: UploadedFile | null | any = null
      if (files) img = files.img

      const result = await CategoryService.updateCategoryById(
        oldName,
        newName,
        img
      )

      return res.status(200).json(result)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async updateOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCResponseMessage> | void> {
    try {
      const { data } = req.body

      const result = await CategoryService.updateOrder(data)

      if (!result) {
        return res
          .status(422)
          .json({ code: 422, status: 'FAILED', message: 'Wrong request data!' })
      }

      return res.status(200).json({ status: 'OK' })
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async getInfoByLevel(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCMGetInfoByLevel[] | null> | void> {
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
  ): Promise<Response<TCMGetBreadcrumb[] | null> | void> {
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
  ): Promise<Response<TCMGetInfoByLevel[] | null> | void> {
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
  ): Promise<Response<TCMGetInfoByLevel[] | null> | void> {
    try {
      const data = await CategoryService.getAllCategoryInfo()
      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }
}

export default new CategoryController()
