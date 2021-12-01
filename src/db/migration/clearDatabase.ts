import db from '../db'
import logger from '../../utils/logger'

const clearDatabase = (): Promise<void> => {
  return new Promise(async (res, rej) => {
    try {
      await db.query(`
      drop schema public cascade;
      create schema public;`)
      logger.info(`clear scheme database!`)
      res()
    } catch (error: any) {
      logger.fatal(error, `clear scheme database!`)
      rej(error)
    }
  })
}

export default clearDatabase
