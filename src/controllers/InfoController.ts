import { Request, Response } from 'express'
import InfoService from '../services/InfoService'

class InfoController {
  public async getInfoData(req: Request, res: Response): Promise<any> {
    const data = await InfoService.getInfoDataOrNull()
    return res.json(data)
  }
}

export default new InfoController()
