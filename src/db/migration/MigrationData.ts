import {
  TDBMJson,
  TDBMDataLabels,
  TDBMDataUnits,
  TDBMDataSuppliers,
  TDBMDataCategoryToProduct,
  TDBMJsonGoods,
} from '../../types'
import PrepareData from './PrepareData'

class MigrationData {
  private _units: TDBMDataUnits[]
  private _suppliers: TDBMDataSuppliers[]
  private _labels: TDBMDataLabels[]
  private _products: TDBMJsonGoods[] = []
  private _categoryToProduct: TDBMDataCategoryToProduct

  constructor(jsonData: TDBMJson) {
    const { Goods } = jsonData
    this._products = PrepareData.productsData(Goods)
    this._labels = [] // PrepareData.labelsTable(['Акции', 'Новинки'])
    this._units = [] // PrepareData.unitsTable(Goods)
    this._suppliers = [] // PrepareData.suppliersTable(Goods)
    this._categoryToProduct = {} // PrepareData.categoryToProductTable(Goods)
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

  public get categoryToProduct() {
    return this._categoryToProduct
  }
}

export default MigrationData
