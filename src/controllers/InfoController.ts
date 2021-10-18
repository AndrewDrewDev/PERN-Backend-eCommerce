import { NextFunction, Request, Response } from 'express'
import InfoService from '../services/InfoService'
import { TGetInfoData } from '../types'
import ErrorHandler from '../error/ErrorHandler'

class InfoController {
  public async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TGetInfoData | null> | void> {
    try {
      const { id } = req.params
      const data = await InfoService.getById(id)
      return res.status(200).json(data)
    } catch (error) {
      next(new ErrorHandler(500, error.message))
    }
  }
}

export default new InfoController()
