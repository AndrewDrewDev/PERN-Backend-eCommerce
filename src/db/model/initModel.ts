import fs from 'fs-extra'
import path from 'path'

import config from '../../config'
import db from '../db'
import ApiError from '../../error/ApiError'

const initModel = async (): Promise<void> => {
  try {
    const sql: string = fs.readFileSync(
      path.resolve(__dirname, './model.sql'),
      'utf-8'
    )
    await db.query(sql)
    ApiError.successLog(`init model of ${config.DB_NAME} database!`)
    return Promise.resolve()
  } catch (err) {
    ApiError.failedLog(`init model of ${config.DB_NAME} database!`)
    return Promise.reject()
  }
}

export default initModel
