import path from 'path'
import excelValidator from 'excel-validator'

import config from '../../config'
import { TDBMJson } from '../../types'
import MigrationDataStore from './MigrationDataStore'
import initModel from '../model/initModel'
import InsertToDB from './InsertToDB'
import logger from '../../utils/logger'

const startMigrate = () => {
  const excelFilePath: string = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'data',
    config.DBM_EXCEL_FILE_NAME
  )

  const configFilePath: string = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'data',
    config.DBM_EXCEL_CONFIG_FILE_NAME
  )

  const jsonData = excelValidator<TDBMJson>({
    setting: {
      configFilePath,
      excelFilePath,
    },
    WSOptions: [
      {
        WSName: 'Goods',
        type: 'horizontal',
      },
      {
        WSName: 'Categories',
        type: 'vertical',
        columns: ['B', 'C'],
      },
      {
        WSName: 'BaseInfo',
        type: 'vertical',
        columns: ['A', 'B'],
      },
    ],
  })
  const migrationData: MigrationDataStore = new MigrationDataStore(jsonData)

  initModel()
    .then(() => InsertToDB.shopConfigTable(migrationData.shopConfig))
    .then(() => InsertToDB.categoriesTable(migrationData.categories))
    .then(() => InsertToDB.labelsTable(migrationData.labels))
    .then(() => InsertToDB.statusesTable(migrationData.statuses))
    .then(() => InsertToDB.unitsTable(migrationData.units))
    .then(() => InsertToDB.suppliersTable(migrationData.suppliers))
    .then(() => InsertToDB.productsTable(migrationData.products))
    .then(() =>
      InsertToDB.categoryToProductTable(migrationData.categoryToProduct)
    )
    .then(() =>
      InsertToDB.customCategoriesTable(migrationData.customCategories)
    )
    .then(() =>
      InsertToDB.customCategoriesProductsTable(
        migrationData.customCategoriesProducts
      )
    )
    .then(() => InsertToDB.imagesTable(migrationData.images))
    .then(() => logger.info('MIGRATE TO DATABASE'))
    .catch(() => logger.fatal('MIGRATE TO DATABASE'))
}

startMigrate()
