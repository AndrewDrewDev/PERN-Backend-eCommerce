import express, { Application } from 'express'
import fileUpload from 'express-fileupload'

import cors from 'cors'
import config from './config'
import routes from './routes'
import errorResponseHandler from './error/errorResponseHandler'
import FileSystemUtils from './utils/FileSystemUtils'

const PORT = process.env.PORT || config.PORT
process.env.PWD = process.cwd()

const app: Application = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({}))
app.use('/api', routes)
app.use(express.static(FileSystemUtils.srcStaticFolderPath))

const start = async () => {
  try {
    console.log(FileSystemUtils.srcStaticFolderPath)
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}!`)
    })
  } catch (e) {
    console.log(e)
  }
}

app.use(errorResponseHandler)

start()
