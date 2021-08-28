import fs from 'fs-extra'
import path from 'path'
import db from '../db'

const initDBModel = () => {
  const sql: string = fs.readFileSync(
    path.resolve(__dirname, './model.sql'),
    'utf-8'
  )
  db.query(sql)
}

export default initDBModel
