import express, { Application, Request, Response } from 'express'
import config from 'config'
import { TPORTConfig } from './types'

const PORT: TPORTConfig = config.get('PORT')

const app: Application = express()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello')
})

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}!`)
})
