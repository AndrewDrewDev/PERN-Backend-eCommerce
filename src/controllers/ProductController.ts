import { NextFunction, Request, Response } from 'express'
import {
  TCProductFullInfo,
  TGetSearchProductsByName,
  TResponseMessage,
  TUpdateOneImgByIdBody,
} from '../types'
import ProductService from '../model/ProductModel'
import ErrorHandler from '../error/ErrorHandler'
import { UploadedFile } from 'express-fileupload'

class ProductController {
  public async getOneById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCProductFullInfo | null> | void> {
    try {
      const { id } = req.params
      const data = await ProductService.getOneById(id)

      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async updateOneInfoById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCProductFullInfo> | void> {
    try {
      const { id } = req.params
      const updateData: TCProductFullInfo = req.body
      const updatedProduct = await ProductService.updateOneInfoById(
        id,
        updateData
      )

      if (!updatedProduct) {
        return res.status(400).json({ message: 'Wrong data format.' })
      }

      return res.status(200).json(updatedProduct)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async updateImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TResponseMessage> | void> {
    try {
      const { oldName, preview }: TUpdateOneImgByIdBody = req.body
      const files = req.files
      // Extract img if exist
      let img: UploadedFile | null | any = null
      if (files && oldName && preview) {
        img = files.img
      } else {
        return res.status(422).send({
          code: 422,
          status: 'FAILED',
          message: 'Upload img not found!',
        })
      }

      const result = await ProductService.updateImage(oldName, preview, img)

      if (!result) {
        return res
          .status(422)
          .json({ code: 422, status: 'FAILED', message: 'Incorrect data!' })
      }

      return res.status(200).json({ status: 'OK' })
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async getSearchByName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TGetSearchProductsByName[] | null> | void> {
    try {
      const { name } = req.params
      const data = await ProductService.getSearchProductsByName(name)

      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async getLabels(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<string[] | null> | void> {
    try {
      const data = await ProductService.getLabels()

      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async getStatuses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<string[] | null> | void> {
    try {
      const data = await ProductService.getStatuses()

      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async getSuppliers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<string[] | null> | void> {
    try {
      const data = await ProductService.getSuppliers()

      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async getUnits(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<string[] | null> | void> {
    try {
      const data = await ProductService.getUnits()

      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }
}

export default new ProductController()
