import { NextFunction, Request, Response } from 'express'
import CategoryModel from '../model/CategoryModel'
import {
  TCMFilterParamsRaw,
  TCMGetBreadcrumb,
  TCMGetInfoByLevel,
  TCMProductsByCategoryData,
  TCResponseMessage,
  TCMFilterParams,
  TCMGetProductsFiltersInfo,
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
      let { name, page, limit, type, price, supplier, label } = req.query as {
        name: string
        page: string
        limit: string
        type: 'custom' | 'common' | 'label' | 'all'
      } & TCMFilterParamsRaw

      const filterObject = filterParamsToObjectIfExistOrNull({
        price,
        supplier,
        label,
      })

      const offset: string = ((Number(page) - 1) * Number(limit)).toString()

      let data = null
      if (type === 'common') {
        data = await CategoryModel.getProductsById({
          categoryUrl: name,
          limit,
          offset,
          filterObject: filterObject,
        })
      } else if (type === 'custom') {
        data = await CategoryModel.getCustomProductsById({
          categoryUrl: name,
          limit,
          offset,
          filterObject: filterObject,
        })
      } else if (type === 'label') {
        data = await CategoryModel.getLabelProductsById({
          labelUrl: name,
          limit,
          offset,
          filterObject: filterObject,
        })
      } else if (type === 'all') {
        data = await CategoryModel.getAllProducts({
          limit,
          offset,
          filterObject: filterObject,
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

      const result = await CategoryModel.updateCategoryById(
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

      const result = await CategoryModel.updateOrder(data)

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
      const data = await CategoryModel.getInfoByLevel(level)
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
      const data = await CategoryModel.getBreadcrumb(url)
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
      const data = await CategoryModel.getCustomCategoryInfo(id)
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
      const data = await CategoryModel.getAllCategoryInfo()
      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async getProductsFiltersByUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCMGetProductsFiltersInfo | TCResponseMessage> | void> {
    try {
      const { type, url } = req.params
      let result: TCMGetProductsFiltersInfo | null = null

      if (type === 'all') {
        result = await CategoryModel.getAllProductsFiltersByUrl()
      } else if (type === 'label') {
        result = await CategoryModel.getLabelProductsFiltersByUrl(url)
      } else {
        result = await CategoryModel.getCommonProductsFiltersByUrl(url)
      }

      return res.status(200).json(result)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }
}

const filterParamsToObjectIfExistOrNull = (
  args: TCMFilterParamsRaw
): TCMFilterParams | null => {
  const { price, supplier, label } = args
  const result: TCMFilterParams = {} as any

  if (price !== undefined) {
    const [min, max] = price.split('-')
    result.price = { min, max }
  }

  if (supplier !== undefined) {
    result.supplier = supplier.split('-')
  }

  if (label !== undefined) {
    result.label = label.split('-')
  }

  return Object.keys(result).length === 0 ? null : result
}

export default new CategoryController()
