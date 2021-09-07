import {
  TDBMDataCategoryToProduct,
  TDBMDataLabels,
  TDBMDataSuppliers,
  TDBMDataUnits,
  TDBMJsonGoods,
  TDBMJsonGoodsRaw,
} from '../../types'

import db from '../db'
import ApiError from '../../error/ApiError'

class InsertToDB {
  public categoriesTable(goods: TDBMJsonGoods[]): void {
    try {
      let categoryCounter: number = 1
      const countCategories: number = goods[0].categories.length

      // Add first category
      for (const product of goods) {
      }

      // ApiError.successLog('migration data to table: categories!')
    } catch (err) {
      ApiError.failedLog('migration data to table: categories!', err)
    }
  }

  public labelsTable(data: TDBMDataLabels[]) {
    try {
      for (const label of data) {
        db.query(
          `insert into labels (name, url) values ('${label.name}', '${label.url}')`
        )
      }
      ApiError.successLog('migration data to table: labels!')
    } catch (err) {
      ApiError.failedLog('migration data to table: labels!', err)
    }
  }

  public unitsTable(units: TDBMDataUnits[]): void {
    try {
      for (const unit of units) {
        db.query(`
      insert into units (name, url) values ('${unit.name}', '${unit.url}')
      `)
      }
      ApiError.successLog('migration data to table: units!')
    } catch (err) {
      ApiError.failedLog('migration data to table: units!', err)
    }
  }

  public suppliersTable(suppliers: TDBMDataSuppliers[]): void {
    try {
      if (suppliers.length > 0) {
        for (const supplier of suppliers) {
          db.query(
            `insert into suppliers (name, url) values ('${supplier.name}', '${supplier.url}')`
          )
        }
        ApiError.successLog('migration data to table: suppliers!')
      } else {
        ApiError.failedLog(
          'migration data to table: suppliers! - Lack in data!'
        )
      }
    } catch (err) {
      ApiError.failedLog('migration data to table: suppliers!', err)
    }
  }

  public productsTable(products: TDBMJsonGoodsRaw[]) {
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

        db.query(`
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
    } catch (err) {
      ApiError.failedLog('migration data to table: products!', err)
    }
  }

  public categoryToProductTable(data: TDBMDataCategoryToProduct): void {
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
    } catch (err) {
      ApiError.failedLog('migration data to table: category_to_product!', err)
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
