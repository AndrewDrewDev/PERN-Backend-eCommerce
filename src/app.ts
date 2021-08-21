import express, { Application } from 'express'
import config from 'config'
import { TPORTConfig } from './types'
import db from './db/db'

const PORT: TPORTConfig = config.get('PORT')

const app: Application = express()

const start = async () => {
  try {
    await db.authenticate()
    await db.sync()
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}!`)
    })
  } catch (e) {
    console.log(e)
  }
}

start()
