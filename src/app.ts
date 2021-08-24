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
    db.initDatabaseModel()
  } catch (e) {
    console.log(e)
  }
}

start()
