import { QueryResult } from 'pg'
import { v4 } from 'uuid'

import {
  TCMProductFullInfo,
  TCMGetSearchProductsByName,
  TCMUpdateOrderImages,
} from '../types'
import db from '../db/db'
import { UploadedFile } from 'express-fileupload'
import path from 'path'
import FileSystemUtils from '../utils/FileSystemUtils'

type TGetOneById = {
  image: string
  ispreview: boolean
  categoryname: string
  categoryurl: string
  name: string
  label: string
  unit: string
  supplier: string
  id: string
  description: string
  price: string
  old_price: string
  amount: string
  vendor_id: string
  status: string
}

class ProductModel {
  public async getOneById(id: string): Promise<TCMProductFullInfo | null> {
    let result: TCMProductFullInfo = {} as any
    const data: QueryResult<TGetOneById> = await db.query(
      `
          select im.name        as image,
                 im.preview     as ispreview,
                 cc.name        as categoryname,
                 cc.url         as categoryurl,
                 pp.name        as name,
                 lb.name        as label,
                 un.name        as unit,
                 su.name        as supplier,
                 pp.product_id  as id,
                 pp.description as description,
                 pp.price       as price,
                 pp.old_price   as old_price,
                 pp.amount      as amount,
                 pp.vendor_id   as vendor_id,
                 st.name        as status
          from category_to_product cp
                   left join
               categories cc
               on
                   cc.id = cp.category_id
                   left join
               products pp
               on
                   pp.product_id = $1
                   left join
               labels lb
               on
                   lb.id = pp.label_id
                   left join
               units un
               on
                   un.id = pp.unit_id
                   left join
               suppliers su
               on
                   su.id = pp.supplier_id
                   left join
               product_images im
               on
                   im.product_id = pp.id
                   left join
               statuses st
               on
                   st.id = pp.status_id
          where cp.product_id = (select id from products pp where pp.product_id = $1)
          ORDER BY cp.level, im.order_index ASC`,
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
      result.vendor_id = item.vendor_id
      result.description = item.description
      result.price = item.price
      result.old_price = item.old_price
      result.amount = `${item.amount}`
      result.status = item.status
    }

    // Check if product not founded in db
    if (!result.name) return null

    return result
  }

  // TCProductFullInfo | TResponseErrorMessage
  public async updateOneInfoById(
    id: string,
    updateProduct: TCMProductFullInfo
  ): Promise<TCMProductFullInfo | null> {
    const currentProduct = await this.getOneById(id)

    if (currentProduct && updateProduct) {
      // update "products" table
      await db.query(
        `update
             products
         set name=$1,
             price=$2,
             old_price=$3,
             vendor_id=$4,
             description=$5,
             amount=$6
         where product_id = $7`,
        [
          updateProduct.name,
          updateProduct.price,
          updateProduct.old_price,
          updateProduct.vendor_id,
          updateProduct.description,
          updateProduct.amount,
          id,
        ]
      )

      // update FK form "labels" table
      await db.query(
        `update products
         set label_id=(select id from labels l where l.name = $1)
         where product_id = $2`,
        [updateProduct.label, id]
      )

      // update FK form "statuses" table
      await db.query(
        `update products
         set status_id=(select id from statuses s where s.name = $1)
         where product_id = $2`,
        [updateProduct.status, id]
      )

      // update FK form "suppliers" table
      await db.query(
        `update products
         set supplier_id=(select id from suppliers s where s.name = $1)
         where product_id = $2`,
        [updateProduct.supplier, id]
      )

      // update FK form "units" table
      await db.query(
        `update products
         set unit_id=(select id from units u where u.name = $1)
         where product_id = $2`,
        [updateProduct.unit, id]
      )
    } else {
      return null
    }
    // return updated product
    return await this.getOneById(id)
  }

  public async getSearchProductsByName(
    name: string
  ): Promise<QueryResult<TCMGetSearchProductsByName>[] | null> {
    const data = await db.query(
      `
          select pp.name       as name,
                 pp.product_id as id,
                 pp.price      as price,
                 im.name       as img
          from products pp
                   left join product_images im on im.product_id = pp.id and im.preview = true
          where pp.name ilike '%${name}%' limit 10
      `
    )

    if (data.rowCount === 0) return null

    return data.rows
  }

  public isProductExist = async (id: string): Promise<boolean> => {
    const isProductExist = await db.query(
      `select *
       from products pp
       where pp.product_id = $1`,
      [id]
    )

    if (isProductExist.rowCount === 0) return false

    return true
  }

  public getLabels = async (): Promise<string[] | null> => {
    const data = await db.query(`select l.name
                                 from labels l`)

    if (data.rowCount === 0) {
      return null
    }

    return data.rows.map(i => i.name)
  }

  public getStatuses = async (): Promise<string[] | null> => {
    const data = await db.query(`select s.name
                                 from statuses s`)

    if (data.rowCount === 0) {
      return null
    }

    return data.rows.map(i => i.name)
  }

  public getSuppliers = async (): Promise<string[] | null> => {
    const data = await db.query(`select s.name
                                 from suppliers s`)

    if (data.rowCount === 0) {
      return null
    }

    return data.rows.map(i => i.name)
  }

  public getUnits = async (): Promise<string[] | null> => {
    const data = await db.query(`select u.name
                                 from units u`)

    if (data.rowCount === 0) {
      return null
    }

    return data.rows.map(i => i.name)
  }

  public async updateImage(
    imgOldName: string,
    preview: 'true' | 'false',
    img: UploadedFile
  ) {
    const isPreview = preview === 'true' || null

    const newImgFileName = v4() + '.jpg'
    await img.mv(
      path.resolve(FileSystemUtils.srcStaticFolderPath, newImgFileName)
    )

    const result = await db.query(
      `update product_images im
       set name=$1,
           preview=$2
       where im.name = $3 returning *`,
      [newImgFileName, isPreview, imgOldName]
    )

    if (result.rowCount === 0) return null

    return result
  }

  public async updateOrderImages(
    updatedData: TCMUpdateOrderImages[]
  ): Promise<true | null> {
    for (const item of updatedData) {
      const { name, order } = item

      const result = await db.query(
        `
            update product_images pi
            set order_index=$1
            where pi.name = $2 returning *`,
        [order, name]
      )
      if (result.rowCount === 0) return null
    }
    return true
  }

  public async addImageById(id: string, img: UploadedFile) {
    const newImgFileName = v4() + '.jpg'
    await img.mv(
      path.resolve(FileSystemUtils.srcStaticFolderPath, newImgFileName)
    )

    const result = await db.query(
      `
          insert into product_images (product_id, name)
          values ((select id from products pp where pp.product_id = $1),
                  $2) returning *`,
      [id, newImgFileName]
    )

    if (result.rowCount === 0) return null

    return result
  }

  public async deleteImageByName(imgName: string) {
    const result = await db.query(
      `delete from product_images im where im.name=$1`,
      [imgName]
    )

    if (result.rowCount === 0) return null

    return result
  }
}

export default new ProductModel()
