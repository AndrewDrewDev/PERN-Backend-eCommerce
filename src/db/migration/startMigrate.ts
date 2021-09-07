import path from 'path'
import fs from 'fs-extra'

import config from '../../config'
import { TDBMJson } from '../../types'
import MigrationData from './MigrationData'
import InsertToDB from './InsertToDB'

const startMigrate = () => {
  const absolutePath: string = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'data',
    config.DBM_JSON_FILE_NAME
  )
  const jsonData: TDBMJson = JSON.parse(fs.readFileSync(absolutePath, 'utf-8'))
  const migrationData = new MigrationData(jsonData)

  InsertToDB.categoriesTable(migrationData.products)
  // InsertToDB.labelsTable(migrationData.labels)
  // InsertToDB.unitsTable(migrationData.units)
  // InsertToDB.suppliersTable(migrationData.suppliers)
  // InsertToDB.productsTable(migrationData.products)
  // InsertToDB.categoryToProductTable(migrationData.categoryToProduct)
}

startMigrate()
