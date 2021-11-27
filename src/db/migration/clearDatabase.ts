import db from '../db'
import logger from '../../utils/logger'
import config from '../../config'

const clearDatabase = (): Promise<void> => {
  return new Promise(async (res, rej) => {
    try {
      await db.query(`
      drop schema public cascade;
      create schema public;`)
      logger.info(`clear scheme ${config.DB_NAME} database!`)
      res()
    } catch (e) {
      logger.error(`clear scheme ${config.DB_NAME} database!`)
      rej(e)
    }
  })
}

export default clearDatabase
