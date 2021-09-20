import path from 'path'
import fs from 'fs-extra'

import config from '../../config'
import { TDBMJson } from '../../types'
import MigrationData from './MigrationData'
import InsertToDB from './InsertToDB'
import initModel from '../model/initModel'
import logger from '../../utils/logger'

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
  const migrationData: MigrationData = new MigrationData(jsonData)

  initModel()
    .then(() => InsertToDB.categoriesTable(migrationData.categories))
    .then(() => InsertToDB.labelsTable(migrationData.labels))
    .then(() => InsertToDB.statusesTable(migrationData.statuses))
    .then(() => InsertToDB.unitsTable(migrationData.units))
    .then(() => InsertToDB.suppliersTable(migrationData.suppliers))
    .then(() => InsertToDB.productsTable(migrationData.products))
    .then(() =>
      InsertToDB.categoryToProductTable(migrationData.categoryToProduct)
    )
    .then(() => InsertToDB.imagesTable(migrationData.images))
    .then(() => logger.info('MIGRATE TO DATABASE'))
    .catch(() => logger.fatal('MIGRATE TO DATABASE'))
}

startMigrate()
