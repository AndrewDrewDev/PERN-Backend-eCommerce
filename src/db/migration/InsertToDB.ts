import {
  TDBMDataCategories,
  TDBMDataLabels,
  TDBMDataSuppliers,
  TDBMDataUnits,
  TDBMJsonGoods,
} from '../../types'
import chalk from 'chalk'

import db from '../db'
import { log } from 'console'

class InsertToDB {
  public categoriesTable(data: TDBMDataCategories[]): void {
    try {
      for (const category of data) {
        db.query(`
      insert into categories (name, url) values ('${category.name}', '${category.url}')
      `)
      }
      console.log(
        `${chalk.bgGreen(
          chalk.black('SUCCESS:')
        )} migration data to table: categories!`
      )
    } catch (err) {
      console.log(
        `${chalk.bgRed(
          chalk.black('FAILED:')
        )} migration data to table: categories!\n\n`,
        err
      )
    }
  }

  public async labelsTable(data: TDBMDataLabels[]) {
    try {
      for (const label of data) {
        await db.query(
          `insert into labels (name, url) values ('${label.name}', '${label.url}')`
        )
      }
      console.log(
        `${chalk.bgGreen(
          chalk.black('SUCCESS:')
        )} migration data to table: labels!`
      )
    } catch (err) {
      console.log(
        `${chalk.bgRed(
          chalk.black('FAILED:')
        )} migration data to table: labels!\n\n`,
        err
      )
    }
  }

  public unitsTable(units: TDBMDataUnits[]): void {
    try {
      for (const unit of units) {
        db.query(`
      insert into units (name, url) values ('${unit.name}', '${unit.url}')
      `)
      }
      console.log(
        `${chalk.bgGreen(
          chalk.black('SUCCESS:')
        )} migration data to table: units!`
      )
    } catch (err) {
      console.log(
        `${chalk.bgRed(
          chalk.black('FAILED:')
        )} migration data to table: units!\n\n`,
        err
      )
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
        console.log(
          `${chalk.bgGreen(
            chalk.black('SUCCESS:')
          )} migration data to table: suppliers!`
        )
      } else {
        console.log(
          `${chalk.bgRed(
            chalk.black('FAILED:')
          )} migration data to table: suppliers! - Lack in data!\n\n`
        )
      }
    } catch (err) {
      console.log(
        `${chalk.bgRed(
          chalk.black('FAILED:')
        )} migration data to table: suppliers!\n\n`,
        err
      )
    }
  }

  public productsTable(products: TDBMJsonGoods[]) {
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
      const vendorId: string = VPT.valueOrNull(product.d747_exProductCodeVender)

      // (SELECT id from foo WHERE id='blue')

      console.log(`
      INSERT INTO products (
        productid,
        name,
        description,
        price,
        oldprice,
        amount,
        vendorId,
        info_id,
        label_id,
        property_id,
        units_id,
        supplie_id,

      ) VALUES
      (${productid},
       ${name},
       ${description},
       ${price},
       ${oldPrice},
       ${amount},
       ${vendorId},

      )`)
    }
  }
}

export class ValidateProductsTable {
  public valueOrNull(value: string): string | 'null' {
    return value ? `'${value}'` : 'null'
  }

  public descriptionOrNull(desc: string): string {
    let result: string = desc
    const replaceFromTo: string[][] = [["'", '']] // ['\'', ''] - from ' to ''

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
