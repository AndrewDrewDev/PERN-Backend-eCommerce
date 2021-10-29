import { QueryResult } from 'pg'
import {
  TDBMDataShopConfig,
  TGetCustomCategoryProducts,
  TResponseMessage,
  TShopControllerGetSlider,
} from '../types'
import db from '../db/db'
import ProductService from './ProductService'

class ShopService {
  public async getConfig(): Promise<QueryResult<TDBMDataShopConfig>[] | null> {
    const data = await db.query(
      `select *
       from shop_config`
    )
    if (data.rows.length === 0) return null
    return data.rows[0]
  }

  public async updateConfig(
    updateData: TDBMDataShopConfig
  ): Promise<QueryResult<TDBMDataShopConfig> | null> {
    const data = await db.query(
      `
          update shop_config
          set title=$1,
              sub_title=$2,
              id=$3,
              base_link=$4,
              address=$5,
              phone=$6,
              email=$7,
              pagination_number=$8,
              currency=$9,
              catalog_page=$10,
              category_number=$11,
              copyright=$12,
              social_network=$13,
              category_cloud_number=$14,
              card_view=$15,
              site_grid_view=$16,
              site_detail_view=$17
          returning *`,
      [
        updateData.title,
        updateData.sub_title,
        updateData.id,
        updateData.base_link,
        updateData.address,
        updateData.phone,
        updateData.email,
        updateData.pagination_number,
        updateData.currency,
        updateData.catalog_page,
        updateData.category_number,
        updateData.copyright,
        updateData.social_network,
        updateData.category_cloud_number,
        updateData.card_view,
        updateData.site_grid_view,
        updateData.site_detail_view,
      ]
    )
    if (data.rows.length === 0) return null
    return data.rows[0]
  }

  public async getSlider(): Promise<
    QueryResult<TShopControllerGetSlider>[] | null
  > {
    const data = await db.query(
      `
          select sl.title,
                 sl.img
          from slider sl
          order by sl.order_index asc
      `
    )

    if (data.rows.length === 0) return null
    return data.rows
  }

  public async getCustomCategoryProductsByName(
    name: string
  ): Promise<TGetCustomCategoryProducts | null> {
    const data = await db.query(
      `
          select cc.name      as category_name,
                 cc.url       as category_url,
                 pp.name,
                 pp.product_id as id,
                 im.name      as img
          from custom_categories cc
                   left join custom_categories_products ccp on cc.id = ccp.custom_categories_id
                   left join products pp on pp.id = ccp.product_id
                   left join images im on pp.id = im.product_id and im.preview = true
          where cc.name = $1
          order by ccp.id asc
      `,
      [name]
    )

    if (data.rowCount === 0) return null
    return data.rows
  }

  public async createCustomCategoryProductsByName(
    categoryName: string,
    updateValue: string
  ): Promise<TResponseMessage> {
    const checkProductIdIfExist = await db.query(
      `select * from products pp where pp.product_id=$1`,
      [updateValue]
    )

    if (checkProductIdIfExist.rowCount === 0)
      return {
        status: 'FAILED',
        message: `Продукта с id: ${updateValue} - не найдено!`,
      }

    await db.query(
      `insert into
          custom_categories_products
          (custom_categories_id, product_id)
          values
          (
           (select id from custom_categories cc where cc.name=$1),
           (select id from products pp where pp.product_id=$2)
          )
          `,
      [categoryName, updateValue]
    )

    return { status: 'OK' }
  }

  public async deleteCustomCategoryProductsByName(
    categoryName: string,
    updateValue: string
  ): Promise<TResponseMessage> {
    const result = await db.query(
      `
      delete  from
        custom_categories_products ccp
      using custom_categories cc, products pp
      where
        pp.id=ccp.product_id
      and
        ccp.custom_categories_id=cc.id
      and
        cc.name=$1
      and
        pp.product_id=$2
      returning *`,
      [categoryName, updateValue]
    )

    if (result.rowCount === 0)
      return {
        status: 'FAILED',
        message: `Ошибка удаления продукта с id: ${updateValue}!`,
      }

    return { status: 'OK' }
  }

  public async updateCustomCategoryProductsByName(
    categoryName: string,
    updateProductsIDs: string[]
  ): Promise<TResponseMessage> {
    // clear all product by custom category name
    await db.query(
      `
      delete  from
        custom_categories_products ccp
      using custom_categories cc, products pp
      where
        pp.id=ccp.product_id
      and
        ccp.custom_categories_id=cc.id
      and
        cc.name=$1
      returning *`,
      [categoryName]
    )

    for (const product_id of updateProductsIDs) {
      const isProductExist = await ProductService.isProductExist(product_id)

      if (!isProductExist) {
        return {
          status: 'FAILED',
          message: `Продукт с id - ${product_id} не найден!`,
        }
      }

      await db.query(
        `
        insert into
          custom_categories_products (custom_categories_id, product_id)
        values
          (
            (select id from custom_categories cc where cc.name=$1),
            (select id from products pp where pp.product_id=$2)
          )`,
        [categoryName, product_id]
      )
    }

    return { status: 'OK' }
  }
}

export default new ShopService()
