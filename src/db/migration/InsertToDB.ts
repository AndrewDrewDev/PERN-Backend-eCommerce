import fs from 'fs-extra'
import path from 'path'
import { v4 } from 'uuid'

import {
  TDBMDataShopConfig,
  TDBMDataCategoriesItem,
  TDBMDataCategoryToProduct,
  TDBMDataImages,
  TDBMDataLabels,
  TDBMDataSuppliers,
  TDBMDataUnits,
  TDBMJsonGoods,
  TDBMDataCustomCategories,
  TDBMDataCustomCategoriesProducts,
} from '../../types'

import db from '../db'
import logger from '../../utils/logger'

class InsertToDB {
  public async categoriesTable(data: TDBMDataCategoriesItem[]): Promise<void> {
    try {
      for (const item of data) {
        const parentName: string = item.parent
          ? `(select id from categories where name='${item.parent.name}')`
          : 'null'
        await db.query(
          `insert into categories (name, url, parentId) values ('${item.category.name}', '${item.category.url}', ${parentName})`
        )
      }
      logger.info('migration data to table: categories!')

      return Promise.resolve()
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (err) {
      logger.fatal('migration data to table: suppliers!', err)
      return Promise.reject()
    }
  }

  public async productsTable(products: TDBMJsonGoods[]): Promise<void> {
    try {
      const VPT = new ValidateProductsTable()

      for (const product of products) {
        const productid: string = VPT.valueOrNull(product.d720_exProductID)
        const name: string = VPT.valueOrNull(product.d721_exProductName)
        const description: string = VPT.descriptionOrNull(
          product.d723_exProductDescription
        )
        const price: string = VPT.valueOrNull(product.d802_exPriceSell)
        const oldPrice: string = VPT.valueOrNull(product.d803_exPriceOldSell)
        const amount: string = VPT.valueOrNull(
          product.d748_exProductAmountRemaind
        )
        const vendorId: string = VPT.valueOrNull(
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
        const units_id = (unit: string): string => {
          return `(SELECT id from units WHERE units.name='${unit}')`
        }
        const supplier_id = (supplier: string): string => {
          if (supplier) {
            return `(SELECT id from suppliers WHERE suppliers.name='${supplier}')`
          }
          return 'null'
        }

        await db.query(`
        INSERT INTO products (
          productid,
          name,
          description,
          price,
          oldprice,
          amount,
          vendorId,
          info_id,
          property_id,
          label_id,
          units_id,
          supplier_id
        ) VALUES
        (${productid},
         ${name},
         ${description},
         ${price},
         ${oldPrice},
         ${amount},
         ${vendorId},
         null,
         null,
         ${label_id(
           product.d734_exProductNew,
           product.d735_exProductDiscounts
         )},
         ${units_id(product.d781_exEd)},
         ${supplier_id(product.d738_exProductManufacturer)}
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
    } catch (err) {
      logger.fatal('migration data to table: category_to_product!', err)
      return Promise.reject()
    }
  }

  public async imagesTable(images: TDBMDataImages): Promise<void> {
    try {
      const staticPath = path.resolve(__dirname, '..', '..', 'static')
      const datasetPath = path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'data',
        'img-goods'
      )

      const writeToDB = async (
        productId: string,
        imgName: string,
        preview?: boolean
      ) => {
        await db.query(
          `
          insert into images
            (product_id, name, preview)
          values
          (
            (select id from products pp where pp.productId=$1),
            $2,
            $3
          )
          `,
          [productId, imgName, preview]
        )
        return Promise.resolve()
      }

      const copyFile = (
        imgName: string,
        newFileName?: string
      ): void | undefined => {
        if (imgName === '000-nonePhoto.jpg') return

        const srcPath = path.resolve(datasetPath, imgName)
        const destPath = path.resolve(staticPath, newFileName ?? imgName)
        fs.copySync(srcPath, destPath)
      }

      // Always copy nonePhoto image
      fs.copySync(
        datasetPath + '/000-nonePhoto.jpg',
        staticPath + '/000-nonePhoto.jpg'
      )

      // Write to db new image name and copy to express static folder
      for (const id in images) {
        const img = images[id]
        img.preview.forEach(async i => {
          const newFileName = v4() + '.jpg'
          await writeToDB(id, newFileName, true).then(() =>
            copyFile(i, newFileName)
          )
        })

        img.big.forEach(async i => {
          const newFileName = v4() + '.jpg'
          await writeToDB(id, newFileName, false).then(() =>
            copyFile(i, newFileName)
          )
        })
      }

      logger.info('migration data to table: images!')
      return Promise.resolve()
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
      productId: string
    ): Promise<void> => {
      await db.query(
        `insert into 
            custom_categories_products 
            (custom_categories_id, product_id)
            values 
            (
             (select id from custom_categories cc where cc.name=$1),
             (select id from products pp where pp.productId=$2)
            )
            `,
        [categoryName, productId]
      )
    }

    try {
      for (const productId of discount) {
        await queryExpression('Акции', productId)
      }

      for (const productId of New) {
        await queryExpression('Новинки', productId)
      }

      logger.info('migration data to table: custom_categories_products!')
      return Promise.resolve()
    } catch (error) {
      logger.fatal(
        error,
        'migration data to table: custom_categories_products!'
      )
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
