import {
  TDBMJson,
  TDBMDataCategories,
  TDBMDataLabels,
  TDBMDataUnits,
} from '../../types'
import PrepareData from './PrepareData'

class MigrationData {
  private _categories: TDBMDataCategories[]
  private _tags: any
  private _units: TDBMDataUnits[]
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
    this._units = PrepareData.unitsTable(Goods)
    this._suppliers = PrepareData.suppliersTable(Goods)
    // console.log(this._suppliers)
  }

  public get categories() {
    return this._categories
  }

  public get labels() {
    return this._labels
  }

  public get units() {
    return this._units
  }

  public get suppliers() {
    return this._suppliers
  }
}

export default MigrationData
