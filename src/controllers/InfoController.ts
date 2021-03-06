import { NextFunction, Request, Response } from 'express'
import InfoService from '../model/InfoModel'
import { TCMGetInfoData, TCResponseMessage } from '../types'
import ErrorHandler from '../error/ErrorHandler'

class InfoController {
  public async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCMGetInfoData | null> | void> {
    try {
      const { id } = req.params
      const data = await InfoService.getById(id)
      return res.status(200).json(data)
    } catch (error: any) {
      next(new ErrorHandler(500, error.message))
    }
  }

  public async updateById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TCResponseMessage> | void> {
    try {
      const { id } = req.params
      const updateData = req.body
      const result = await InfoService.updateById(id, updateData)
      if (!result) {
        return res.status(400).json({
          code: 400,
          status: 'FAILED',
          message: 'Wrong request data!',
        })
      }
      return res.status(200).json({ status: 'OK' })
    } catch (error: any) {
      next(new ErrorHandler(500, error.message))
    }
  }
}

export default new InfoController()
