import fs from 'fs-extra'
import path from 'path'

import db from '../db'
import logger from '../../utils/logger'
import getEnvVariable from '../../utils/getEnvVariable'

const initModel = async (): Promise<void> => {
  try {
    const sql: string = fs.readFileSync(
      path.resolve(__dirname, './model.sql'),
      'utf-8'
    )
    await db.query(sql)
    logger.info(`init model of ${getEnvVariable('DB_NAME')} database!`)
    return Promise.resolve()
  } catch (error: any) {
    logger.error(error, `init model of ${getEnvVariable('DB_NAME')} database!`)
    return Promise.reject()
  }
}

export default initModel
