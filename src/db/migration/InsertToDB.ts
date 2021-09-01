import { TDBMDataCategories } from '../../types'
import db from '../db'

class InsertToDB {
  constructor() {
    console.log(111)
  }

  public categoriesTable(data: TDBMDataCategories[]): void {
    for (const category of data) {
      db.query(`
      insert into categories (name, url) values ('${category.name}', '${category.url}')
      `)
    }
  }
}

export default new InsertToDB()
