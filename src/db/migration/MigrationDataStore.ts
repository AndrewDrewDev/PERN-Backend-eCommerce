import {
  TDBMJson,
  TDBMDataLabels,
  TDBMDataUnits,
  TDBMJsonGoods,
  TDBMDataSuppliers,
  TDBMDataCategoryToProduct,
  TDBMDataCategoriesItem,
  TDBMDataProductImages,
  TDBMDataShopConfig,
  TDBMDataCustomCategories,
  TDBMDataCustomCategoriesProducts,
  TDBMDataInfoPages,
  TDBMDataSlider,
} from '../types'
import PrepareData from './PrepareData'

class MigrationDataStore {
  private readonly _categories: TDBMDataCategoriesItem[]
  private readonly _units: TDBMDataUnits[]
  private readonly _suppliers: TDBMDataSuppliers[]
  private readonly _labels: TDBMDataLabels[]
  private readonly _products: TDBMJsonGoods[]
  private readonly _categoryToProduct: TDBMDataCategoryToProduct
  private readonly _productImages: TDBMDataProductImages
  private readonly _statuses: string[]
  private readonly _shopConfig: TDBMDataShopConfig
  private readonly _customCategories: TDBMDataCustomCategories[]
  private readonly _customCategoriesProducts: TDBMDataCustomCategoriesProducts
  private readonly _infoPages: TDBMDataInfoPages[]
  private readonly _slider: TDBMDataSlider[]

  constructor(jsonData: TDBMJson) {
    const { Goods, Categories, BaseInfo } = jsonData
    this._products = Goods
    this._categories = PrepareData.categoriesTable(Goods, Categories)
    this._labels = PrepareData.labelsTable(['Акции', 'Новинки'])
    this._units = PrepareData.unitsTable(Goods)
    this._suppliers = PrepareData.suppliersTable(Goods)
    this._categoryToProduct = PrepareData.categoryToProductTable(Goods)
    this._productImages = PrepareData.imagesTable(Goods)
    this._statuses = PrepareData.statusesTable(Goods)
    this._shopConfig = PrepareData.shopConfigTable(BaseInfo)
    this._customCategories = PrepareData.customCategoriesTable([
      'Акции',
      'Новинки',
    ])
    this._customCategoriesProducts = PrepareData.customCategoriesProductsTable({
      discount: BaseInfo.d599_exShopSiteDiscountCards,
      New: BaseInfo.d600_exShopSiteNewCards,
    })
    this._infoPages = PrepareData.infoPagesTable()
    this._slider = PrepareData.sliderTable(BaseInfo)
  }

  get slider(): TDBMDataSlider[] {
    return this._slider
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

  get productImages(): TDBMDataProductImages {
    return this._productImages
  }

  get statuses(): string[] {
    return this._statuses
  }

  get shopConfig(): TDBMDataShopConfig {
    return this._shopConfig
  }
}

export default MigrationDataStore
