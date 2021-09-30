import fs from 'fs-extra'
import path from 'path'
import { v4 } from 'uuid'

class FileSystemService {
  private readonly _srcStaticFolderPath: string
  private readonly _datasetImgGoodsFolderPath: string

  constructor() {
    this._srcStaticFolderPath = path.resolve(
      __dirname,
      '..',
      '..',
      'src',
      'static'
    )
    this._datasetImgGoodsFolderPath = path.resolve(
      __dirname,
      '..',
      '..',
      'data',
      'img-goods'
    )
  }

  public copyImgFileToStaticWithNewName(filePath: string): string {
    try {
      const excludeFileName: string[] = ['000-nonePhoto.jpg']
      const fileName: string | undefined = filePath.split('/').pop()
      const newFileName = v4() + '.jpg'

      if (fileName && excludeFileName.includes(fileName)) return fileName

      fs.copySync(
        filePath,
        path.resolve(this._srcStaticFolderPath, newFileName)
      )

      return newFileName
    } catch (error) {
      return error
    }
  }

  get srcStaticFolderPath() {
    return this._srcStaticFolderPath
  }

  get datasetImgGoodsFolderPath() {
    return this._datasetImgGoodsFolderPath
  }
}

export default new FileSystemService()
