import { QueryResult } from 'pg'
import { TDBMDataShopConfig, TShopControllerGetSlider } from '../types'
import db from '../db/db'

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
}

export default new ShopService()
