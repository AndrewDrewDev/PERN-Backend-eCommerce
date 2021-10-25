import express, { Application } from 'express'
import fileUpload from 'express-fileupload'

import cors from 'cors'
import config from './config'
import routes from './routes'
import path from 'path'
import errorResponseHandler from './error/errorResponseHandler'

const PORT = config.PORT

const app: Application = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({}))
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

app.use(errorResponseHandler)

start()
