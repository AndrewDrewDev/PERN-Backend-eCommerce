import { QueryResult } from 'pg'
import { TCProductGetOneService, TCProductGetOneResult } from '../types'
import db from '../db/db'
import logger from '../utils/logger'

class ProductService {
  public async getOneById(id: string): Promise<TCProductGetOneResult | null> {
    try {
      let result: TCProductGetOneResult = {} as any
      const data: QueryResult<TCProductGetOneService> = await db.query(
        `
      select
        im.name as image,
        im.preview as ispreview,
        cc.name as categoryname,
        cc.url as categoryurl,
        pp.name as name,
        lb.name as label,
        un.name as unit,
        su.name as supplier,
        pp.productId as id,
        pp.description as description,
        pp.price as price,
        pp.oldPrice as oldPrice,
        pp.amount as amount,
        pp.vendorid as vendorid,
        st.name as status
      from
        category_to_product cp
      left join
        categories cc
      on
        cc.id=cp.category_id
      left join
        products pp
      on
        pp.productId=$1
      left join
        labels lb
      on
        lb.id=pp.label_id
      left join
        units un
      on
        un.id=pp.units_id
      left join
        suppliers su
      on
       su.id=pp.supplier_id
      left join
        images im
      on
       im.product_id=pp.id
      left join
      statuses st
      on
      st.id=pp.id
      where
        cp.product_id=(select id from products pp where pp.productId=$1)
      ORDER BY
        cp.level ASC`,
        [id]
      )

      // Preparation & Combine data
      result.categories = []
      result.images = { preview: '', big: [] }
      const temp: string[] = []
      for (const item of data.rows) {
        if (!temp.includes(item.categoryname)) {
          result.categories.push({
            name: item.categoryname,
            url: item.categoryurl,
          })
          temp.push(item.categoryname)
        }

        if (!temp.includes(item.image)) {
          if (item.ispreview) {
            result.images.preview = item.image
          } else {
            result.images.big.push(item.image)
          }

          temp.push(item.image)
        }

        result.name = item.name
        result.label = item.label
        result.unit = item.unit
        result.supplier = item.supplier
        result.id = item.id
        result.vendorId = item.vendorid
        result.description = item.description
        result.price = item.price
        result.oldPrice = item.oldprice
        result.amount = item.amount
        result.status = item.status
      }

      // Check if product not founded in db
      if (!result.name) return null

      return result
    } catch (error) {
      throw logger.error(error, 'ProductService.getOneById occurred error')
    }
  }
}

export default new ProductService()
