///////////////////////////////////////////////////////////////////////////////
//
// Database types
// T - type
// DB - database
// DBM - database migrate

export type TDBMJson = {
  BaseInfo: TDBMJsonBaseInfo
  Categories: TDBMJsonCategories
  Goods: TDBMJsonGoods[]
}

export type TDBMJsonGoods = {
  d691_exCategory1: string
  d692_exCategory2: string
  d693_exCategory3: string
  d720_exProductID: string
  d721_exProductName: string
  d734_exProductNew: string
  d735_exProductDiscounts: string
  d727_exProductProperty: string
  d802_exPriceSell: string
  d781_exEd: string
  d803_exPriceOldSell: string
  d723_exProductDescription: string
  d748_exProductAmountRemaind: string
  d722_exProductInStock: string
  d747_exProductCodeVender: string
  d738_exProductManufacturer: string
}

export type TDBMJsonBaseInfo = {
  d582_exShopSiteTitle: string
  d583_exShopSiteSubTitle: string
  d580_exShopSiteID: string
  d581_exShopSiteBaseLink: string
  d584_exShopSiteAddress: string
  d585_exShopSitePhone: string
  d586_exShopSiteEmail: string
  d587_exShopSitePaginationNumber: string
  d589_exShopSiteCurrency: string
  d588_exShopSiteCatalogPage: string
  d590_exShopSiteCategoryNumber: string
  d593_exShopSiteTheme: string
  d591_exShopSiteCopyright: string
  d594_exShopSiteSocialNetwork: string
  d595_exShopSiteCategoryCloudNumber: string
  d601_exShopSiteCardView: string
  d602_exShopSiteGridView: string
  d603_exShopSiteDetailView: string
  d691_exCategory1: string
  d692_exCategory2: string
  d693_exCategory3: string
  d592_exShopSiteSliderHeader: string
  d599_exShopSiteDiscountCards: string
  d600_exShopSiteNewCards: string
}

export type TDBMJsonCategories = {
  [key: string]: string
}

export type TDBMDataCategories = {
  name: string
  url: string
  img?: string
}

export type TDBMDataCategoriesItem = {
  category: TDBMDataCategories
  parent?: TDBMDataCategories
}

export type TDBMDataLabels = {
  name: string
  url: string
}

export type TDBMDataUnits = {
  name: string
  url: string
}

export type TDBMDataSuppliers = {
  name: string
  url: string
}

export type TDBMDataCategoryToProduct = {
  [key: string]: string[]
}

export type TDBMDataProductImages = {
  [key: string]: {
    preview: string[]
    big: string[]
  }
}

export type TDBMDataShopConfig = {
  title: string
  sub_title: string
  id: string
  base_link: string
  address: string
  phone: string
  email: string
  pagination_number: string
  currency: string
  catalog_page: string
  category_number: string
  copyright: string
  social_network: string
  category_cloud_number: string
  card_view: string
  site_grid_view: string
  site_detail_view: string
}

export type TDBMDataCustomCategories = {
  name: string
  url: string
}

export type TDBMDataCustomCategoriesProducts = {
  discount: string[]
  New: string[]
}

export type TDBMDataInfoPagesImg = {
  name: string
  path: string
}

export type TDBMDataInfoPages = {
  name: string
  url: string
  content: string
  img: TDBMDataInfoPagesImg[] | null
}

export type TDBMDataSlider = {
  title: string
  imgPath: string
  order_index: number
}
