import fs from 'fs-extra'
import path from 'path'

import config from '../../config'
import db from '../db'
import logger from '../../utils/logger'

const initModel = async (): Promise<void> => {
  try {
    const sql: string = fs.readFileSync(
      path.resolve(__dirname, './model.sql'),
      'utf-8'
    )
    await db.query(sql)
    logger.info(`init model of ${config.DB_NAME} database!`)
    return Promise.resolve()
  } catch (error) {
    logger.error(error, `init model of ${config.DB_NAME} database!`)
    return Promise.reject()
  }
}

export default initModel
