import express, { Application } from 'express'

import cors from 'cors'
import config from './config'
import routes from './routes'
import path from 'path'

const PORT = config.PORT

const app: Application = express()
app.use(cors())
app.use(express.json())
app.use('/api', routes)
app.use(express.static(path.resolve(__dirname, 'static')))

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
