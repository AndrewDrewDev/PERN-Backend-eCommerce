import {
  TDBMDataCategories,
  TDBMDataLabels,
  TDBMDataSuppliers,
  TDBMDataUnits,
} from '../../types'
import db from '../db'

class InsertToDB {
  public categoriesTable(data: TDBMDataCategories[]): void {
    for (const category of data) {
      db.query(`
      insert into categories (name, url) values ('${category.name}', '${category.url}')
      `)
    }
    console.log(`Успешная миграция таблицы categories!`)
  }

  public labelsTable(data: TDBMDataLabels[]): void {
    for (const label of data) {
      db.query(`
      insert into labels (name, url) values ('${label.name}', '${label.url}')
      `)
    }
    console.log(`Успешная миграция таблицы labels!`)
  }

  public unitsTable(units: TDBMDataUnits[]): void {
    for (const unit of units) {
      db.query(`
      insert into units (name, url) values ('${unit.name}', '${unit.url}')
      `)
    }
    console.log(`Успешная миграция таблицы units!`)
  }

  public suppliersTable(suppliers: TDBMDataSuppliers[]): void {
    for (const supplier of suppliers) {
      db.query(
        `insert into suppliers (name, url) values ('${supplier.name}', '${supplier.url}')`
      )
    }
    console.log(`Успешная миграция таблицы suppliers!`)
  }
}

export default new InsertToDB()
