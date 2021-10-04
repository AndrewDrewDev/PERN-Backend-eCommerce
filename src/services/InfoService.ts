import { TGetInfoDataOrNull } from '../types'
import logger from '../utils/logger'
import db from '../db/db'

type TGetInfoDataOrNullQueryResult = {
  name: string
  url: string
  content: string
  img: string
}

class InfoService {
  public async getById(id: string): Promise<TGetInfoDataOrNull | null> {
    try {
      const data = await db.query(
        `
          select
              ip.name as name,
              ip.url as url,
              ip.content as content,
              ipi.name as img
          from info_pages ip
                   left join info_pages_images ipi on ipi.info_page_id=ip.id
          where
              ip.url=$1`,
        [id]
      )

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
  const result: TGetInfoDataOrNull = {} as any
  result.img = []
  for (const elem of array) {
    result.name = elem.name
    result.url = elem.url
    result.content = elem.content

    if (elem.img && result.img) {
      result.img.push(elem.img)
    } else {
      result.img = null
    }
  }
  return result
}

export default new InfoService()
