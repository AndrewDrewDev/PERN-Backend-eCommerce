import db from '../db'
import logger from '../../utils/logger'
import getEnvVariable from '../../utils/getEnvVariable'

const clearDatabase = (): Promise<void> => {
  return new Promise(async (res, rej) => {
    try {
      await db.query(`
      drop schema public cascade;
      create schema public;`)
      logger.info(`clear scheme ${getEnvVariable('DB_NAME')} database!`)
      res()
    } catch (error: any) {
      logger.fatal(error, `clear scheme ${getEnvVariable('DB_NAME')} database!`)
      rej(error)
    }
  })
}

export default clearDatabase
