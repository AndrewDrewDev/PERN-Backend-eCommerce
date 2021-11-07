import { v4 } from 'uuid'

import {
  TCMProductsByCategoryData,
  TCMGetInfoByLevel,
  TCMGetBreadcrumb,
  TCResponseMessage,
  TCMFilterParams,
} from '../types'
import { QueryResult } from 'pg'
import db from '../db/db'
import FileSystemUtils from '../utils/FileSystemUtils'
import { UploadedFile } from 'express-fileupload'
import path from 'path/posix'

type TFilterParams = TCMFilterParams | null

class CategoryModel {
  public async getProductsById(args: {
    categoryUrl: string
    limit: string
    offset: string
    filterObject: TFilterParams
  }): Promise<QueryResult<TCMProductsByCategoryData>[] | null> {
    const { categoryUrl, limit, offset, filterObject } = args

    const whereSequence = filterObjectToSqlWhere({
      prefix: `where cc.url = $1
            and cc.id = cp.category_id
            and pp.id = cp.product_id`,
      filterObject,
    })

    const data = await db.query(
      `
          select pp.name       as name,
                 pp.product_id as id,
                 pp.price      as price,
                 pp.old_price  as old_price,
                 lb.name       as label,
                 im.name       as img
          from products pp
                   left join category_to_product cp on pp.id = cp.product_id
                   left join categories cc on cc.url = $1 and cc.id = cp.category_id
                   left join labels lb on lb.id = pp.label_id
                   left join product_images im on im.product_id = pp.id and im.preview = true
                   left join suppliers sp on sp.id = pp.supplier_id
          ${whereSequence}
          group by pp.id,
                   im.name,
                   lb.name
          limit $2 offset $3
      `,
      [categoryUrl, limit, offset]
    )
    if (data.rows.length === 0) return null
    return data.rows
  }

  public async updateCategoryById(
    oldName: string,
    newName: string,
    img: UploadedFile | null
  ): Promise<TCResponseMessage> {
    // update img if exist
    if (img) {
      const fileName = v4() + '.jpg'
      await img.mv(path.resolve(FileSystemUtils.srcStaticFolderPath, fileName))
      await db.query(
        `update categories cc
         set img=$1
         where cc.name = $2`,
        [fileName, oldName]
      )
    }

    // update category name
    await db.query(
      `update categories cc
       set name=$1
       where cc.name = $2 `,
      [newName, oldName]
    )

    return { status: 'OK' }
  }

  public async updateOrder(
    updateData: {
      name: string
      index: number
    }[]
  ): Promise<TCResponseMessage> {
    for (const updateItem of updateData) {
      const { name, index } = updateItem

      await db.query(
        `update categories cc
         set order_index=$1
         where cc.name = $2`,
        [index, name]
      )
    }

    return { status: 'OK' }
  }

  public async getInfoByLevel(
    level: string
  ): Promise<QueryResult<TCMGetInfoByLevel>[] | null> {
    const result = await db.query(
      `
          select count(pp) as count, cc.name, cc.url, cc.img
          from categories cc
                   left join category_to_product cp on cp.category_id = cc.id and cp.level = $1
                   left join products pp on cp.product_id = pp.id
          where cp.level is not null
          group by cc.name, cc.order_index, cc.url, cp.level, cc.img
          order by cc.order_index asc`,
      [level]
    )

    if (result.rows.length === 0) return null
    return result.rows
  }

  public async getBreadcrumb(
    categoryUrl: string
  ): Promise<TCMGetBreadcrumb[] | null> {
    const data: QueryResult<TCMGetBreadcrumb> = await db.query(
      `
          with recursive tree(id, name, url, parent_id) as (
              select n.id, n.name, n.url, n.parent_id
              from categories n
              where n.url = $1
              union all
              select n.id, n.name, n.url, n.parent_id
              from categories n
                       join tree t on (n.id = t.parent_id)
          )
          select *
          from tree t
          ORDER BY t.parent_id ASC nulls FIRST`,
      [categoryUrl]
    )

    if (data.rows.length === 0) return null

    return data.rows.map(i => {
      return { name: i.name, url: i.url }
    })
  }

  public async getCustomProductsById(args: {
    categoryUrl: string
    limit: string
    offset: string
    filterObject: TFilterParams
  }): Promise<QueryResult<TCMProductsByCategoryData>[] | null> {
    const { categoryUrl, limit, offset, filterObject } = args

    const whereSequence = filterObjectToSqlWhere({
      prefix: `where ct.id = ccp.custom_categories_id`,
      filterObject,
    })

    const data = await db.query(
      `
          select pp.name       as name,
                 pp.product_id as id,
                 pp.price      as price,
                 pp.old_price  as old_price,
                 st.name       as status,
                 lb.name       as label,
                 im.name       as img
          from custom_categories_products ccp
                   left join custom_categories ct on ct.url = $1
                   left join products pp on pp.id = ccp.product_id
                   left join statuses st on pp.status_id = st.id
                   left join labels lb on pp.label_id = lb.id
                   left join product_images im on pp.id = im.product_id and im.preview = true
                   left join suppliers sp on sp.id = pp.supplier_id
          ${whereSequence}
          order by ccp.id asc
          limit $2 offset $3
      `,
      [categoryUrl, limit, offset]
    )

    if (data.rows.length === 0) return null

    return data.rows
  }

  public async getLabelProductsById(args: {
    labelUrl: string
    limit: string
    offset: string
    filterObject: TFilterParams
  }): Promise<QueryResult<TCMProductsByCategoryData>[] | null> {
    const { labelUrl, limit, offset, filterObject } = args

    const whereSequence = filterObjectToSqlWhere({
      prefix: `where pp.label_id = ll.id`,
      filterObject,
    })

    const data = await db.query(
      `select pp.name       as name,
              pp.product_id as id,
              pp.price      as price,
              pp.old_price  as old_price,
              st.name       as status,
              ll.name       as label,
              im.name       as img
       from products pp
                left join labels ll on ll.url = $1
                left join statuses st on st.id = pp.status_id
                left join product_images im on pp.id = im.product_id and im.preview = true
                left join suppliers sp on sp.id = pp.supplier_id
       ${whereSequence}
       limit $2 offset $3`,
      [labelUrl, limit, offset]
    )

    if (data.rows.length === 0) return null

    return data.rows
  }

  public async getAllProducts(args: {
    limit: string
    offset: string
    filterObject: TFilterParams
  }): Promise<QueryResult<TCMProductsByCategoryData>[] | null> {
    const { limit, offset, filterObject } = args

    const whereSequence = filterObjectToSqlWhere({
      filterObject,
    })
    console.log(whereSequence)

    const data = await db.query(
      `
          select pp.name       as name,
                 pp.product_id as id,
                 pp.price      as price,
                 pp.old_price  as old_price,
                 lb.name       as label,
                 im.name       as img
          from products pp
                   left join statuses st on pp.status_id = st.id
                   left join labels lb on pp.label_id = lb.id
                   left join product_images im on pp.id = im.product_id and im.preview = true
                   left join suppliers sp on sp.id = pp.supplier_id
          ${whereSequence}
          limit $1 offset $2
      `,
      [limit, offset]
    )

    if (data.rows.length === 0) return null

    return data.rows
  }

  public async getCustomCategoryInfo(
    id: string
  ): Promise<TCMGetInfoByLevel[] | null> {
    const data = await db.query(
      `select (select count(ccp.id) as count
               from custom_categories cc
                        left join custom_categories_products ccp on cc.id = ccp.custom_categories_id
               where cc.url = $1),
              cc.name,
              cc.url
       from custom_categories cc
       where cc.url = $1`,
      [id]
    )

    if (data.rows.length === 0) return null

    return data.rows
  }

  public async getAllCategoryInfo(): Promise<TCMGetInfoByLevel[] | null> {
    const data = await db.query(`select count(*)
                                 from products`)

    if (data.rows.length === 0) return null
    return [
      {
        name: 'Каталог :: Все категории :: Все товары',
        url: 'all',
        img: null,
        count: data.rows[0].count,
      },
    ]
  }
}

const filterObjectToSqlWhere = (args: {
  prefix?: string
  filterObject: TCMFilterParams | null
}): string => {
  let { prefix, filterObject } = args

  // prefix by default in not exist
  if (!prefix) prefix = 'where true'
  if (filterObject === null) return prefix

  const result = prefix ? [prefix] : []

  const { price, supplier, label } = filterObject

  if (price) {
    const { min, max } = price
    result.push(`pp.price::float BETWEEN ${min} AND ${max}`)
  }

  if (supplier) {
    const supplierWhereExpression = supplier.map(id => `sp.id = ${id}`)
    result.push(`(${supplierWhereExpression.join(' OR ')})`)
    // supplier.forEach(id => result.push(`sp.id = ${id}`))
  }

  if (label) {
    const labelWhereExpression = label.map(id => `lb.id = ${id}`)
    result.push(`(${labelWhereExpression.join(' OR ')})`)
  }

  return result.join(' and ')
}

export default new CategoryModel()
