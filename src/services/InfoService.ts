import { TGetInfoDataOrNull } from '../types'
import logger from '../utils/logger'
import db from '../db/db'

type TGetInfoDataOrNullQueryResult = {
  name: string
  content: string
  img: string
}

class InfoService {
  public async getInfoDataOrNull(): Promise<TGetInfoDataOrNull | null> {
    try {
      const data = await db.query(`
      select
        ip.name as name,
        ip.content as content,
        ipi.name as img
      from info_pages ip
      left join info_pages_images ipi on ipi.info_page_id=ip.id`)

      if (data.rows.length === 0) return null

      return combineInfoData(data.rows)
    } catch (error) {
      throw logger.error(error, 'getInfoDataOrNull occurred error')
    }
  }
}

function combineInfoData(
  array: TGetInfoDataOrNullQueryResult[]
): TGetInfoDataOrNull {
  const result: any = {}
  for (const elem of array) {
    if (!result[elem.name]) {
      result[elem.name] = {}
      result[elem.name].img = []
    }
    result[elem.name].content = elem.content
    if (elem.img) {
      result[elem.name].img.push(elem.img)
    } else {
      result[elem.name].img = null
    }
  }
  return result
}

export default new InfoService()
