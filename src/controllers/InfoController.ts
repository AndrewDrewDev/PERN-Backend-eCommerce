import { NextFunction, Request, Response } from 'express'
import InfoService from '../services/InfoService'
import { TGetInfoData } from '../types'
import logger from '../utils/logger'

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
      next(logger.error(error, 'InfoController.getById occurred error'))
    }
  }
}

export default new InfoController()
