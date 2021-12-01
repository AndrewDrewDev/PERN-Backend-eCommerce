import express, { Application } from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import routes from './routes'
import errorResponseHandler from './error/errorResponseHandler'
import FileSystemUtils from './utils/FileSystemUtils'
import getEnvVariable from './utils/getEnvVariable'

import dotenv from 'dotenv'
dotenv.config()

const PORT = getEnvVariable('PORT')

const app: Application = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({}))
app.use('/api', routes)
app.use(express.static(FileSystemUtils.srcStaticFolderPath))

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
