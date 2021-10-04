import { NextFunction, Request, Response } from 'express'
import InfoService from '../services/InfoService'
import { TGetInfoDataOrNull } from '../types'
import logger from '../utils/logger'

class InfoController {
  public async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TGetInfoDataOrNull | null> | void> {
    try {
      const { id } = req.params
      const data = await InfoService.getById(id)
      return res.status(200).json(data)
    } catch (error) {
      next(logger.error(error, 'InfoController.getInfoData occurred error'))
    }
  }
}

export default new InfoController()
