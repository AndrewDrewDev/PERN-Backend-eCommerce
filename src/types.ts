// Main server config
export type TConfigPort = number
export type Tconfig = {
  readonly PORT: TConfigPort
  readonly DBM_JSON_FILE_NAME: string
  readonly DB_NAME: string
  readonly DB_USER: string
  readonly DB_PASSWORD: string
  readonly DB_HOST: string
  readonly DB_PORT: number
  readonly SECRET_KEY: string
}

// Database types
// DB - database
// DBM - database migrate

export type TDBMJson = {
  BaseInfo: TDBMJsonBaseInfo
  Categories: TDBMJsonCatefories
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

export type TDBMJsonCatefories = {
  [key: string]: string
}

export type TDBMDataCategories = {
  name: string
  url: string
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
