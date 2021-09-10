import { Request, Response } from 'express'
import { QueryResult } from 'pg'
import db from '../db/db'
import { TCproductGetOneData, TCproductGetOneResult } from '../types'

class ProductController {
  public async getOne(req: Request, res: Response) {
    const result: TCproductGetOneResult = {} as any
    const { id } = req.params
    const data: QueryResult<TCproductGetOneData> = await db.query(
      `
      select
        cc.name as categoryName,
        cc.url as categoryUrl,
        pp.name as name,
        lb.name as label,
        un.name as unit,
        su.name as supplier,
        pp.productId as id,
        pp.description as description,
        pp.price as price,
        pp.oldPrice as oldPrice,
        pp.amount as amount,
        pp.vendorId as vendorId
      from
        category_to_product cp
      left join
        categories cc
      on cc.id=cp.category_id
        left join
      products pp
        on pp.productId=$1
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
      where
       cp.product_id=(select id from products pp where pp.productId=$1)
      ORDER BY
        cp.level ASC`,
      [id]
    )

    result.categories = []
    for (const item of data.rows) {
      result.categories.push({
        name: item.categoryname,
        url: item.categoryurl,
      })
      result.name = item.name
      result.label = item.label
      result.unit = item.unit
      result.supplier = item.supplier
      result.id = item.id
      result.description = item.description
      result.price = item.price
      result.oldPrice = item.oldPrice
      result.amount = item.amount
      result.vendorId = item.vendorId
    }

    return res.json(result)
  }
}

export default new ProductController()
