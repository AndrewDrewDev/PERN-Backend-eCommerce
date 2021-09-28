import { Request, Response } from 'express'
import { TDBMDataShopConfig } from '../types'
import ShopService from '../services/ShopService'

class ShopController {
  public async getConfigOrNullIfNotExist(
    req: Request,
    res: Response
  ): Promise<Response<TDBMDataShopConfig | null>> {
    const data = await ShopService.getConfig()
    return res.json(...data)
  }
}

export default new ShopController()
