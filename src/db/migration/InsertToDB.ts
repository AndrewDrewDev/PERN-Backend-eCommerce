import fs from 'fs-extra'

import {
  TDBMDataShopConfig,
  TDBMDataCategoriesItem,
  TDBMDataCategoryToProduct,
  TDBMDataProductImages,
  TDBMDataLabels,
  TDBMDataSuppliers,
  TDBMDataUnits,
  TDBMJsonGoods,
  TDBMDataCustomCategories,
  TDBMDataCustomCategoriesProducts,
  TDBMDataInfoPages,
  TDBMDataSlider,
} from '../types'

import db from '../db'
import logger from '../../utils/logger'
import StaticFolderService from '../../utils/FileSystemUtils'
import FileSystemService from '../../utils/FileSystemUtils'

class InsertToDB {
  public async categoriesTable(data: TDBMDataCategoriesItem[]): Promise<void> {
    try {
      for (const item of data) {
        const parentName: string | null = item.parent
          ? `(select id from categories where name='${item.parent.name}')`
          : 'null'
        let img: string | null = null

        if (item.category.img) {
          img = FileSystemService.copyImgFileToStatic(item.category.img, true)
        }

        await db.query(
          `insert into categories (name, url, img, parent_id) values ($1, $2, $3, ${parentName})`,
          [item.category.name, item.category.url, img]
        )
      }

      logger.info('migration data to table: categories!')
      return Promise.resolve()
    } catch (error: any) {
      logger.fatal(error, 'migration data to table: categories!')
      return Promise.reject()
    }
  }

  public async labelsTable(data: TDBMDataLabels[]): Promise<void> {
    try {
      for (const label of data) {
        await db.query(
          `insert into labels (name, url) values ('${label.name}', '${label.url}')`
        )
      }
      logger.info('migration data to table: labels!')
      return Promise.resolve()
    } catch (error: any) {
      logger.fatal(error, 'migration data to table: labels!')
      return Promise.reject()
    }
  }

  public async unitsTable(units: TDBMDataUnits[]): Promise<void> {
    try {
      for (const unit of units) {
        await db.query(`
      insert into units (name, url) values ('${unit.name}', '${unit.url}')
      `)
      }
      logger.info('migration data to table: units!')
      return Promise.resolve()
    } catch (error: any) {
      logger.fatal(error, 'migration data to table: units!')
      return Promise.reject()
    }
  }

  public async suppliersTable(suppliers: TDBMDataSuppliers[]): Promise<void> {
    try {
      if (suppliers.length > 0) {
        for (const supplier of suppliers) {
          await db.query(
            `insert into suppliers (name, url) values ('${supplier.name}', '${supplier.url}')`
          )
        }
        logger.info('migration data to table: suppliers!')
        return Promise.resolve()
      } else {
        logger.fatal('migration data to table: suppliers! - Lack in data!')
        return Promise.reject()
      }
    } catch (error: any) {
      logger.fatal(error, 'migration data to table: suppliers!')
      return Promise.reject()
    }
  }

  public async productsTable(products: TDBMJsonGoods[]): Promise<void> {
    try {
      const VPT = new ValidateProductsTable()

      for (const product of products) {
        const product_id: string = VPT.valueOrNull(product.d720_exProductID)
        const name: string = VPT.valueOrNull(product.d721_exProductName)
        const description: string = VPT.descriptionOrNull(
          product.d723_exProductDescription
        )
        const price: string = VPT.valueOrNull(product.d802_exPriceSell)
        const old_price: string = VPT.valueOrNull(product.d803_exPriceOldSell)
        const amount: string = VPT.valueOrNull(
          product.d748_exProductAmountRemaind
        )
        const vendor_id: string = VPT.valueOrNull(
          product.d747_exProductCodeVender
        )
        const label_id = (New: string, discount: string): string => {
          if (New) {
            return `(SELECT id from labels WHERE labels.name='Новинки')`
          } else if (discount) {
            return `(SELECT id from labels WHERE labels.name='Акции')`
          } else {
            return 'null'
          }
        }
        const unit_id = (unit: string): string => {
          return `(SELECT id from units WHERE units.name='${unit}')`
        }
        const supplier_id = (supplier: string): string => {
          if (supplier) {
            return `(SELECT id from suppliers WHERE suppliers.name='${supplier}')`
          }
          return 'null'
        }
        const status_id = (status: string): string => {
          return `(SELECT id FROM statuses st WHERE st.name='${status}')`
        }

        await db.query(`
        INSERT INTO products (
          product_id,
          name,
          description,
          price,
          old_price,
          amount,
          vendor_id,
          info_id,
          property_id,
          label_id,
          unit_id,
          supplier_id,
          status_id
        ) VALUES
        (${product_id},
         ${name},
         ${description},
         ${price},
         ${old_price},
         ${amount},
         ${vendor_id},
         null,
         null,
         ${label_id(
           product.d734_exProductNew,
           product.d735_exProductDiscounts
         )},
         ${unit_id(product.d781_exEd)},
         ${supplier_id(product.d738_exProductManufacturer)},
         ${status_id(product.d722_exProductInStock)}
        )`)
      }
      logger.info('migration data to table: products!')
      return Promise.resolve()
    } catch (err) {
      logger.fatal('migration data to table: products!', err)
      return Promise.reject()
    }
  }

  public async categoryToProductTable(
    data: TDBMDataCategoryToProduct
  ): Promise<void> {
    try {
      for (const name in data) {
        const categArr: string[] = data[name]
        for (const key in categArr) {
          const category: string = categArr[key]
          db.query(`
           INSERT INTO category_to_product (
           category_id,
           product_id,
           level )
           VALUES
           (
           (SELECT id FROM categories cc WHERE cc.name='${category}'),
           (SELECT id FROM products pp WHERE pp.name='${name}'),
           ${Number(key) + 1}
           )
           `)
        }
      }
      logger.info('migration data to table: category_to_product!')
      return Promise.resolve()
    } catch (error: any) {
      logger.fatal(error, 'migration data to table: category_to_product!')
      return Promise.reject()
    }
  }

  public async productImagesTable(
    images: TDBMDataProductImages
  ): Promise<void> {
    try {
      const writeToDB = async (
        product_id: string,
        imgName: string,
        preview?: boolean
      ) => {
        await db.query(
          `
          insert into product_images
            (product_id, name, preview)
          values
          (
            (select id from products pp where pp.product_id=$1),
            $2,
            $3
          )
          `,
          [product_id, imgName, preview]
        )
        return Promise.resolve()
      }

      // Always copy nonePhoto image
      fs.copySync(
        StaticFolderService.datasetImgGoodsFolderPath + '/000-nonePhoto.jpg',
        StaticFolderService.srcStaticFolderPath + '/000-nonePhoto.jpg'
      )

      // Write to db new image name and copy to express static folder
      for (const id in images) {
        const img = images[id]

        for (const imgPath of img.preview) {
          const newFileName = FileSystemService.copyImgFileToStatic(
            imgPath,
            true
          )
          await writeToDB(id, newFileName, true)
        }

        for (const imgPath of img.big) {
          const newFileName = FileSystemService.copyImgFileToStatic(
            imgPath,
            true
          )
          await writeToDB(id, newFileName, false)
        }
      }

      logger.info('migration data to table: product_images!')
      return Promise.resolve()
    } catch (error: any) {
      logger.fatal(error, 'migration data to table: category_to_product!')
      return Promise.reject()
    }
  }

  public async statusesTable(statuses: string[]): Promise<void> {
    try {
      for (const status of statuses) {
        await db.query(`insert into statuses (name) values ($1)`, [status])
      }

      logger.info('migration data to table: statuses!')
      return Promise.resolve()
    } catch (error: any) {
      logger.fatal(error, 'migration data to table: statuses!')
      return Promise.reject()
    }
  }

  public async shopConfigTable(shopConfig: TDBMDataShopConfig): Promise<void> {
    try {
      await db.query(
        `
        insert into shop_config (
            title,
            sub_title,
            id,
            base_link,
            address,
            phone,
            email,
            pagination_number,
            currency,
            catalog_page,
            category_number,
            copyright,
            social_network,
            category_cloud_number,
            card_view,
            site_grid_view,
            site_detail_view
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      `,
        [
          shopConfig.title,
          shopConfig.sub_title,
          shopConfig.id,
          shopConfig.base_link,
          shopConfig.address,
          shopConfig.phone,
          shopConfig.email,
          shopConfig.pagination_number,
          shopConfig.currency,
          shopConfig.catalog_page,
          shopConfig.category_number,
          shopConfig.copyright,
          shopConfig.social_network,
          shopConfig.category_cloud_number,
          shopConfig.card_view,
          shopConfig.site_grid_view,
          shopConfig.site_detail_view,
        ]
      )
      logger.info('migration data to table: shop_config!')
      return Promise.resolve()
    } catch (error: any) {
      logger.fatal(error, 'migration data to table: shop_config!')
      return Promise.reject()
    }
  }

  public async customCategoriesTable(
    categoriesData: TDBMDataCustomCategories[]
  ): Promise<void> {
    try {
      for (const item of categoriesData) {
        await db.query(
          `insert into custom_categories (name, url) values ($1, $2)`,
          [item.name, item.url]
        )
      }
      logger.info('migration data to table: custom_categories!')
      return Promise.resolve()
    } catch (error: any) {
      logger.fatal(error, 'migration data to table: custom_categories!')
      return Promise.resolve()
    }
  }

  public async customCategoriesProductsTable({
    discount,
    New,
  }: TDBMDataCustomCategoriesProducts): Promise<void> {
    const queryExpression = async (
      categoryName: 'Акции' | 'Новинки',
      product_id: string
    ): Promise<void> => {
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
        [categoryName, product_id]
      )
    }

    try {
      for (const product_id of discount) {
        await queryExpression('Акции', product_id)
      }

      for (const product_id of New) {
        await queryExpression('Новинки', product_id)
      }

      logger.info('migration data to table: custom_categories_products!')
      return Promise.resolve()
    } catch (error: any) {
      logger.fatal(
        error,
        'migration data to table: custom_categories_products!'
      )
      return Promise.resolve()
    }
  }

  public async infoPagesTable(
    infoPageData: TDBMDataInfoPages[]
  ): Promise<void> {
    try {
      for (const infoPageItem of infoPageData) {
        const { name, url, content } = infoPageItem
        await db.query(
          `insert into info_pages (name, url, content) values ($1, $2, $3)`,
          [name, url, content]
        )
      }

      logger.info('migration data to table: info_pages!')
      return Promise.resolve()
    } catch (error: any) {
      logger.fatal(error, 'migration data to table: info_pages!')
      return Promise.resolve()
    }
  }

  public async infoPagesImagesTable(
    infoPagesData: TDBMDataInfoPages[]
  ): Promise<void> {
    try {
      for (const infoPageItem of infoPagesData) {
        const { url, img } = infoPageItem
        if (img) {
          for (const item of img) {
            const fileName = FileSystemService.copyImgFileToStatic(item.path)
            await db.query(
              `insert into info_pages_images (name, info_page_id) values ($1, (select id from info_pages ip where ip.url=$2))`,
              [fileName, url]
            )
          }
        }
      }

      logger.info('migration data to table: info_pages_images!')
      return Promise.resolve()
    } catch (error: any) {
      logger.fatal(error, 'migration data to table: info_pages_images!')
      return Promise.resolve()
    }
  }

  public async sliderTable(sliderData: TDBMDataSlider[]): Promise<void> {
    try {
      for (const sliderItem of sliderData) {
        const fileName = FileSystemService.copyImgFileToStatic(
          sliderItem.imgPath
        )
        await db.query(
          `INSERT INTO slider (title, img, order_index) VALUES ($1, $2, $3)`,
          [sliderItem.title, fileName, sliderItem.order_index]
        )
      }
      logger.info('migration data to table: slider!')
      return Promise.resolve()
    } catch (error: any) {
      logger.fatal(error, 'migration data to table: slider!')
      return Promise.resolve()
    }
  }
}

export class ValidateProductsTable {
  public valueOrNull(value: string): string | 'null' {
    return value ? `'${value}'` : 'null'
  }

  public descriptionOrNull(desc: string): string {
    let result: string = desc
    const replaceFromTo: string[][] = [["'", "\\'"]] // ['\'', ''] - from ' to ''

    // If description empty line
    if (!desc) return 'null'

    for (const handler of replaceFromTo) {
      const [from, to] = handler
      const regex = new RegExp(from, 'g')
      result = result.replace(regex, to)
    }

    return `'${result}'`
  }
}

export default new InsertToDB()
