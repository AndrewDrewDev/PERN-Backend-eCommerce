import { NextFunction, Request, Response } from 'express'
import {
  TCMProductFullInfo,
  TCMGetSearchProductsByName,
  TCResponseMessage,
  TCMUpdateOrderImages,
} from '../types'
import ProductModel from '../model/ProductModel'
import ErrorHandler from '../error/ErrorHandler'
import { UploadedFile } from 'express-fileupload'

class ProductController {
  public async getOneById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCMProductFullInfo | null> | void> {
    try {
      const { id } = req.params
      const data = await ProductModel.getOneById(id)

      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async updateOneInfoById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCMProductFullInfo> | void> {
    try {
      const { id } = req.params
      const updateData: TCMProductFullInfo = req.body
      const updatedProduct = await ProductModel.updateOneInfoById(
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
  ): Promise<Response<TCResponseMessage> | void> {
    try {
      const {
        oldName,
        preview,
      }: {
        oldName: string
        preview: 'true' | 'false'
      } = req.body
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

      const result = await ProductModel.updateImage(oldName, preview, img)

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
  ): Promise<Response<TCMGetSearchProductsByName[] | null> | void> {
    try {
      const { name } = req.params
      const data = await ProductModel.getSearchProductsByName(name)

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
      const data = await ProductModel.getLabels()

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
      const data = await ProductModel.getStatuses()

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
      const data = await ProductModel.getSuppliers()

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
      const data = await ProductModel.getUnits()

      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async updateOrderImages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCResponseMessage> | void> {
    try {
      const body: TCMUpdateOrderImages[] = req.body

      const result = ProductModel.updateOrderImages(body)

      if (!result) return res.status(422).send({})

      return res.status(200).json(req.body)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async addImageById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCResponseMessage> | void> {
    try {
      const { id } = req.params

      // Extract images
      const files = req.files
      let img: UploadedFile | null | any = null
      if (files) img = files.img

      if (!id) {
        return res.status(400).json({
          code: 400,
          status: 'FAILED',
          message: 'Request parameter not found!',
        })
      }

      if (!files) {
        return res.status(400).json({
          code: 400,
          status: 'FAILED',
          message: 'Image in body of request not found!',
        })
      }

      const result = await ProductModel.addImageById(id, img)

      if (!result)
        res.status(422).send({
          code: 422,
          status: 'FAILED',
          message: 'Failed write attempt! Logical error in request.',
        })

      return res.status(200).json({ status: 'OK' })
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async deleteImageByName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCResponseMessage> | void> {
    try {
      const { imgName } = req.params

      if (!imgName) {
        return res.status(400).send({
          code: 400,
          status: 'FAILED',
          message: 'Wrong request parameter, imgName not fount!',
        })
      }

      const result = await ProductModel.deleteImageByName(imgName)

      if (!result)
        res.status(422).send({
          code: 422,
          status: 'FAILED',
          message: 'Failed write attempt! Logical error in request.',
        })

      return res.status(200).send({ status: 'OK' })
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }
}

export default new ProductController()
