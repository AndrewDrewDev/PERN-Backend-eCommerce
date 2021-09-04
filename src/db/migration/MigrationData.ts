import {
  TDBMJson,
  TDBMDataCategories,
  TDBMDataLabels,
  TDBMDataUnits,
  TDBMJsonGoods,
} from '../../types'
import PrepareData from './PrepareData'

class MigrationData {
  private _categories: TDBMDataCategories[]
  private _units: TDBMDataUnits[]
  private _suppliers: any
  private _labels: TDBMDataLabels[]
  private _products: TDBMJsonGoods[]

  constructor(jsonData: TDBMJson) {
    const { Goods } = jsonData
    this._products = Goods
    this._categories = PrepareData.categoriesTable(Goods)
    this._labels = PrepareData.labelsTable(['Акции', 'Новинки'])
    this._units = PrepareData.unitsTable(Goods)
    this._suppliers = PrepareData.suppliersTable(Goods)
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

  public get products() {
    return this._products
  }
}

export default MigrationData
