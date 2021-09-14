import fs from 'fs-extra'
import path from 'path'
import { v4 } from 'uuid'

import {
  TDBMDataCategoriesItem,
  TDBMDataCategoryToProduct,
  TDBMDataImages,
  TDBMDataLabels,
  TDBMDataSuppliers,
  TDBMDataUnits,
  TDBMJsonGoods,
} from '../../types'

import db from '../db'
import ApiError from '../../error/ApiError'

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
      ApiError.successLog('migration data to table: categories!')

      return Promise.resolve()
    } catch (err) {
      ApiError.failedLog('migration data to table: categories!', err)
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
      ApiError.successLog('migration data to table: labels!')
      return Promise.resolve()
    } catch (err) {
      ApiError.failedLog('migration data to table: labels!', err)
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
      ApiError.successLog('migration data to table: units!')
      return Promise.resolve()
    } catch (err) {
      ApiError.failedLog('migration data to table: units!', err)
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
        ApiError.successLog('migration data to table: suppliers!')
        return Promise.resolve()
      } else {
        ApiError.failedLog(
          'migration data to table: suppliers! - Lack in data!'
        )
        return Promise.reject()
      }
    } catch (err) {
      ApiError.failedLog('migration data to table: suppliers!', err)
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
      ApiError.successLog('migration data to table: products!')
      return Promise.resolve()
    } catch (err) {
      ApiError.failedLog('migration data to table: products!', err)
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
      ApiError.successLog('migration data to table: category_to_product!')
      return Promise.resolve()
    } catch (err) {
      ApiError.failedLog('migration data to table: category_to_product!', err)
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

      ApiError.successLog('migration data to table: images!')
      return Promise.resolve()
    } catch (err) {
      ApiError.failedLog('migration data to table: category_to_product!', err)
      return Promise.reject()
    }
  }

  public async statusesTable(statuses: string[]): Promise<void> {
    try {
      for (const status of statuses) {
        await db.query(`insert into statuses (name) values ($1)`, [status])
      }

      ApiError.successLog('migration data to table: statuses!')
      return Promise.resolve()
    } catch (err) {
      ApiError.failedLog('migration data to table: statuses!', err)
      return Promise.reject()
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
