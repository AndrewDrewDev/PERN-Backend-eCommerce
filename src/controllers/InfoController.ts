import { NextFunction, Request, Response } from 'express'
import InfoService from '../services/InfoService'
import { TGetInfoDataOrNull } from '../types'
import logger from '../utils/logger'

class InfoController {
  public async getInfoData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<TGetInfoDataOrNull | null> | void> {
    try {
      const { id } = req.params
      const data = await InfoService.getInfoDataOrNull(id)
      return res.json(data)
    } catch (error) {
      next(logger.error(error, 'InfoController.getInfoData occurred error'))
    }
  }
}

export default new InfoController()
