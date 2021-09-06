import fs from 'fs-extra'
import path from 'path'

import config from '../../config'
import db from '../db'
import ApiError from '../../error/ApiError'

const initModel = () => {
  try {
    const sql: string = fs.readFileSync(
      path.resolve(__dirname, './model.sql'),
      'utf-8'
    )
    db.query(sql)
    ApiError.successLog(
      `Initialization structure of ${config.DB_NAME} database!`
    )
  } catch (err) {
    ApiError.failedLog(
      `Initialization structure of ${config.DB_NAME} database!`
    )
  }
}

initModel()
