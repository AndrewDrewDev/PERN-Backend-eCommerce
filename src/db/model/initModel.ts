import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'

import config from '../../config'
import db from '../db'

const initModel = () => {
  try {
    const sql: string = fs.readFileSync(
      path.resolve(__dirname, './model.sql'),
      'utf-8'
    )
    db.query(sql)
    console.log(
      `${chalk.bgGreen(chalk.black('SUCCESS:'))} Initialization structure of ${
        config.DB_NAME
      } database!`
    )
  } catch (err) {
    console.log(
      `${chalk.bgRed(chalk.black('FAILED:'))} Initialization structure of ${
        config.DB_NAME
      } database!\n\n`,
      err
    )
  }
}

initModel()
