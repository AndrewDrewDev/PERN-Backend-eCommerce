import express, { Application } from 'express'
import config from 'config'
import { TPORTConfig } from './types'
import db from './db/db'
import cors from 'cors'

const PORT: TPORTConfig = config.get('PORT')

const app: Application = express()
app.use(cors())
app.use(express.json())

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}!`)
    })
    const user: string = `select product.name as product_name, label.name as label_name from product left join label on product.label_id=label.id;`

    const result = await db.query(user)
    console.log(result.rows)
  } catch (e) {
    console.log(e)
  }
}

start()
