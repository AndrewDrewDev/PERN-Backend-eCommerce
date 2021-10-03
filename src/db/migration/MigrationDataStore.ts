import {
  TDBMJson,
  TDBMDataLabels,
  TDBMDataUnits,
  TDBMJsonGoods,
  TDBMDataSuppliers,
  TDBMDataCategoryToProduct,
  TDBMDataCategoriesItem,
  TDBMDataImages,
  TDBMDataShopConfig,
  TDBMDataCustomCategories,
  TDBMDataCustomCategoriesProducts,
  TDBMDataInfoPages,
} from '../../types'
import PrepareData from './PrepareData'

class MigrationDataStore {
  private readonly _categories: TDBMDataCategoriesItem[]
  private readonly _units: TDBMDataUnits[]
  private readonly _suppliers: TDBMDataSuppliers[]
  private readonly _labels: TDBMDataLabels[]
  private readonly _products: TDBMJsonGoods[]
  private readonly _categoryToProduct: TDBMDataCategoryToProduct
  private readonly _images: TDBMDataImages
  private readonly _statuses: string[]
  private readonly _shopConfig: TDBMDataShopConfig
  private readonly _customCategories: TDBMDataCustomCategories[]
  private readonly _customCategoriesProducts: TDBMDataCustomCategoriesProducts
  private readonly _infoPages: TDBMDataInfoPages[]

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
    this._shopConfig = PrepareData.shopConfigTable(BaseInfo)
    this._customCategories = PrepareData.customCategoriesTable([
      'Акции',
      'Новинки',
    ])
    this._customCategoriesProducts = PrepareData.customCategoriesProducts({
      discount: BaseInfo.d599_exShopSiteDiscountCards,
      New: BaseInfo.d600_exShopSiteNewCards,
    })
    this._infoPages = PrepareData.infoPages()
  }

  get infoPages(): TDBMDataInfoPages[] {
    return this._infoPages
  }

  get customCategoriesProducts(): TDBMDataCustomCategoriesProducts {
    return this._customCategoriesProducts
  }

  get customCategories(): TDBMDataCustomCategories[] {
    return this._customCategories
  }

  get categories(): TDBMDataCategoriesItem[] {
    return this._categories
  }

  get units(): TDBMDataUnits[] {
    return this._units
  }

  get suppliers(): TDBMDataSuppliers[] {
    return this._suppliers
  }

  get labels(): TDBMDataLabels[] {
    return this._labels
  }

  get products(): TDBMJsonGoods[] {
    return this._products
  }

  get categoryToProduct(): TDBMDataCategoryToProduct {
    return this._categoryToProduct
  }

  get images(): TDBMDataImages {
    return this._images
  }

  get statuses(): string[] {
    return this._statuses
  }

  get shopConfig(): TDBMDataShopConfig {
    return this._shopConfig
  }
}

export default MigrationDataStore
