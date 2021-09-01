import express, { Application } from 'express'
import { TPORTConfig } from './types'
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
  } catch (e) {
    console.log(e)
  }
}

start()
