import { QueryResult } from 'pg'
import {
  TDBMDataShopConfig,
  TGetCustomCategoryProducts,
  TGetCustomCategoryProductsItem,
  TShopControllerGetSlider,
} from '../types'
import db from '../db/db'
import { log } from 'util'

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

  public async getCustomCategoryProducts(): Promise<TGetCustomCategoryProducts | null> {
    const result: TGetCustomCategoryProducts = {}

    type TCategoryNames = { name: string }
    const categoriesNames: QueryResult<TCategoryNames> = await db.query(
      `select cc.name
       from custom_categories cc`
    )

    if (categoriesNames.rows.length === 0) return null

    for (const categoryName of categoriesNames.rows) {
      const categoryData: QueryResult<TGetCustomCategoryProductsItem> =
        await db.query(
          `
              select cc.name      as category_name,
                     pp.name,
                     pp.productid as id,
                     im.name      as img
              from custom_categories cc
                       left join custom_categories_products ccp on cc.id = ccp.custom_categories_id
                       left join products pp on pp.id = ccp.product_id
                       left join images im on pp.id = im.product_id and im.preview = true
              where cc.name = $1
          `,
          [categoryName.name]
        )
      if (categoryData.rows.length !== 0)
        result[categoryData.rows[0].category_name] = categoryData.rows
    }

    if (Object.keys(result).length === 0) return null

    return result
  }
}

export default new ShopService()
