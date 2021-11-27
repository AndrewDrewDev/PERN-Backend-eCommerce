import fs from 'fs-extra'
import path from 'path'
import { v4 } from 'uuid'

class FileSystemUtils {
  private readonly _srcStaticFolderPath: string
  private readonly _datasetImgGoodsFolderPath: string
  private readonly _datasetSliderFolderPath: string
  private readonly _datasetImgCategoryFolderPath: string

  constructor() {
    this._srcStaticFolderPath = path.join(process.cwd(), 'static')
    this._datasetImgGoodsFolderPath = path.resolve(
      __dirname,
      '..',
      '..',
      'data',
      'img-goods'
    )

    this._datasetSliderFolderPath = path.resolve(
      __dirname,
      '..',
      '..',
      'data',
      'img-slider'
    )

    this._datasetImgCategoryFolderPath = path.resolve(
      __dirname,
      '..',
      '..',
      'data',
      'img-category'
    )
  }

  public copyImgFileToStatic(
    filePath: string,
    hashName: boolean = false
  ): string {
    const excludeFileName: string[] = ['000-nonePhoto.jpg']
    const fileName: string | any = filePath.split('/').pop()
    const newFileName = hashName ? v4() + '.jpg' : fileName

    if (fileName && excludeFileName.includes(fileName)) return fileName

    fs.copySync(filePath, path.resolve(this._srcStaticFolderPath, newFileName))

    return newFileName
  }

  public clearStaticFolder(): void {
    const excludes = ['.gitkeep']
    const imagesNames = fs.readdirSync(this.srcStaticFolderPath)

    for (const imagesName of imagesNames) {
      if (!excludes.includes(imagesName)) {
        fs.removeSync(this.srcStaticFolderPath + '/' + imagesName)
      }
    }
  }

  get srcStaticFolderPath() {
    return this._srcStaticFolderPath
  }

  get datasetImgGoodsFolderPath() {
    return this._datasetImgGoodsFolderPath
  }

  get datasetSliderFolderPath() {
    return this._datasetSliderFolderPath
  }

  get datasetImgCategoryFolderPath() {
    return this._datasetImgCategoryFolderPath
  }
}

export default new FileSystemUtils()
