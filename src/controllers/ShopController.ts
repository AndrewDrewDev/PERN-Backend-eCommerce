import { NextFunction, Request, Response } from 'express'
import {
  TCMGetCustomCategoryProducts,
  TCResponseMessage,
  TCMShopControllerGetSlider,
} from '../types'
import ShopService from '../model/ShopModel'
import ErrorHandler from '../error/ErrorHandler'
import { TDBMDataShopConfig } from '../db/types'

class ShopController {
  public async getConfig(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TDBMDataShopConfig | null> | void> {
    try {
      const data = await ShopService.getConfig()
      return res.status(200).json(data)
    } catch (error: any) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async updateConfig(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TDBMDataShopConfig | null> | void> {
    try {
      const updateData: TDBMDataShopConfig = req.body
      const data = await ShopService.updateConfig(updateData)
      return res.status(200).json(data)
    } catch (error: any) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async getSlider(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCMShopControllerGetSlider[] | null> | void> {
    try {
      const data = await ShopService.getSlider()
      return res.status(200).json(data)
    } catch (error: any) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async getCustomCategoryProductsByName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCMGetCustomCategoryProducts | null> | void> {
    try {
      const { name } = req.params
      const data = await ShopService.getCustomCategoryProductsByName(name)
      return res.status(200).json(data)
    } catch (error: any) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async createCustomCategoryProductsByName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCResponseMessage> | void> {
    try {
      const { name } = req.params
      const { data } = req.body

      const result = await ShopService.createCustomCategoryProductsByName(
        name,
        data
      )

      return res.status(200).json(result)
    } catch (error: any) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async deleteCustomCategoryProductsByName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCResponseMessage> | void> {
    try {
      const { name } = req.params
      const { data } = req.body

      const result = await ShopService.deleteCustomCategoryProductsByName(
        name,
        data
      )

      return res.status(200).json(result)
    } catch (error: any) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async updateCustomCategoryProductsByName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCResponseMessage> | void> {
    try {
      const { name } = req.params
      const { data } = req.body

      const result = await ShopService.updateCustomCategoryProductsByName(
        name,
        data
      )

      return res.status(200).json(result)
    } catch (error: any) {
      next(new ErrorHandler(500, error.message))
    }
  }
}

export default new ShopController()
