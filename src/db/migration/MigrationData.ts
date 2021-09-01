import { TDBMJson, TDBMDataCategories, TDBMDataLabels } from '../../types'
import PrepareData from './PrepareData'

class MigrationData {
  private _categories: TDBMDataCategories[]
  private _tags: any
  private _units: any
  private _suppliers: any
  private _labels: TDBMDataLabels[]
  private _products: any
  private _category_to_product: any
  private _tag_to_product: any
  private _info: any
  private _properties: any

  constructor(jsonData: TDBMJson) {
    const { Goods } = jsonData
    this._categories = PrepareData.categoriesTable(Goods)
    this._labels = PrepareData.labelsTable()
    // console.log(this._labels);
  }

  public get categories() {
    return this._categories
  }
}

export default MigrationData
