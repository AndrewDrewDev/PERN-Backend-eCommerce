import fs from 'fs-extra'
import path from 'path'
import config from '../../config'
import db from '../db'

const initModel = () => {
  const sql: string = fs.readFileSync(
    path.resolve(__dirname, './model.sql'),
    'utf-8'
  )
  db.query(sql)

  console.log(
    `\n\nУспешная инициализация структуры базы данных ${config.DB_NAME}!\n\n`
  )
}

initModel()
// export default initDBModel
