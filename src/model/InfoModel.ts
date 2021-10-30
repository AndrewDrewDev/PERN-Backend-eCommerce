import { TGetInfoData } from '../types'
import db from '../db/db'
import { QueryResult } from 'pg'

type TGetInfoDataOrNullQueryResult = {
  name: string
  url: string
  content: string
  img: string
}

type TUpdateByIdData = {
  name: string
  content: string
}

class InfoModel {
  public async getById(id: string): Promise<TGetInfoData | null> {
    const combineInfoData = (
      array: TGetInfoDataOrNullQueryResult[]
    ): TGetInfoData => {
      const result: TGetInfoData = {} as any
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
  }

  public async updateById(
    id: string,
    updateData: TUpdateByIdData
  ): Promise<QueryResult<any> | null> {
    const { name, content } = updateData
    const result = await db.query(
      `update info_pages ip set name=$1, content=$2 where ip.url=$3 returning *`,
      [name, content, id]
    )

    if (result.rowCount === 0) return null

    return result
  }
}

export default new InfoModel()
