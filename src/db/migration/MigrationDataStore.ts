import {
  TDBMJson,
  TDBMDataLabels,
  TDBMDataUnits,
  TDBMJsonGoods,
  TDBMDataSuppliers,
  TDBMDataCategoryToProduct,
  TDBMDataCategoriesItem,
  TDBMDataImages,
  TDBMJsonBaseInfo,
} from '../../types'
import PrepareData from './PrepareData'

class MigrationDataStore {
  private _categories: TDBMDataCategoriesItem[]
  private _units: TDBMDataUnits[]
  private _suppliers: TDBMDataSuppliers[]
  private _labels: TDBMDataLabels[]
  private _products: TDBMJsonGoods[]
  private _categoryToProduct: TDBMDataCategoryToProduct
  private _images: TDBMDataImages
  private _statuses: string[]
  // private _baseInfo: TDBMJsonBaseInfo

  constructor(jsonData: TDBMJson) {
    const { Goods, BaseInfo } = jsonData
    this._products = Goods
    this._categories = PrepareData.categoriesTable(Goods)
    this._labels = PrepareData.labelsTable(['Акции', 'Новинки'])
    this._units = PrepareData.unitsTable(Goods)
    this._suppliers = PrepareData.suppliersTable(Goods)
    this._categoryToProduct = PrepareData.categoryToProductTable(Goods)
    this._images = PrepareData.imagesTable(Goods)
    this._statuses = PrepareData.statusesTable(Goods)
    // this._baseInfo = PrepareData.baseInfoTable(BaseInfo)
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

  public get categoryToProduct() {
    return this._categoryToProduct
  }

  public get images() {
    return this._images
  }

  public get statuses() {
    return this._statuses
  }
}

export default MigrationDataStore
