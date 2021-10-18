import iuliia from 'iuliia'
import path from 'path'
import fs from 'fs-extra'

import {
  TDBMDataShopConfig,
  TDBMDataCategoriesItem,
  TDBMDataCategoryToProduct,
  TDBMDataImages,
  TDBMDataLabels,
  TDBMDataSuppliers,
  TDBMDataUnits,
  TDBMJsonBaseInfo,
  TDBMJsonGoods,
  TDBMDataCustomCategories,
  TDBMDataCustomCategoriesProducts,
  TDBMDataInfoPagesImg,
  TDBMDataInfoPages,
  TDBMDataSlider,
  TDBMJsonCategories,
} from '../../types'
import StaticFolderService from '../../utils/FileSystemUtils'
import FileSystemService from '../../utils/FileSystemUtils'

class PrepareData {
  public categoriesTable(
    goods: TDBMJsonGoods[],
    categories: TDBMJsonCategories
  ): TDBMDataCategoriesItem[] {
    const result: TDBMDataCategoriesItem[] = []
    const tempArray: string[] = []

    for (const p of goods) {
      const category1 = p.d691_exCategory1
      const category2 = p.d692_exCategory2
      const category3 = p.d693_exCategory3

      if (category1 && !tempArray.includes(category1)) {
        const categoryItem: TDBMDataCategoriesItem = {} as any

        categoryItem.category = {
          name: category1,
          url: transliterateWord(category1),
        }
        if (categories[category1])
          categoryItem.category.img = path.resolve(
            FileSystemService.datasetImgCategoryFolderPath,
            categories[category1] + '.jpg'
          )

        tempArray.push(category1)
        result.push(categoryItem)
      }

      if (category2 && !tempArray.includes(category2)) {
        const categoryItem: TDBMDataCategoriesItem = {} as any

        categoryItem.category = {
          name: category2,
          url: transliterateWord(category2),
        }

        categoryItem.parent = {
          name: category1,
          url: transliterateWord(category1),
        }

        tempArray.push(category2)
        result.push(categoryItem)
      }

      if (category3 && !tempArray.includes(category3)) {
        const categoryItem: TDBMDataCategoriesItem = {} as any

        categoryItem.category = {
          name: category3,
          url: transliterateWord(category3),
        }

        categoryItem.parent = {
          name: category2,
          url: transliterateWord(category2),
        }

        tempArray.push(category3)
        result.push(categoryItem)
      }
    }
    return result
  }

  // TODO: Add lables tables to excel
  public labelsTable(labels: string[]): TDBMDataLabels[] {
    const result: TDBMDataLabels[] = []

    for (const label of labels) {
      result.push({
        name: label,
        url: transliterateWord(label),
      })
    }

    return result
  }

  public unitsTable(data: TDBMJsonGoods[]): TDBMDataUnits[] {
    const result: TDBMDataUnits[] = []
    const allUnits: string[] = []
    let uniqueUnits: string[] = []

    for (const product of data) {
      allUnits.push(product.d781_exEd)
    }

    uniqueUnits = Array.from(new Set(allUnits))
    for (const unit of uniqueUnits) {
      result.push({
        name: unit,
        url: transliterateWord(unit),
      })
    }

    return result
  }

  public suppliersTable(data: TDBMJsonGoods[]): TDBMDataSuppliers[] {
    const result: TDBMDataSuppliers[] = []
    const allSuppliers: string[] = []
    let uniqueSuppliers: string[] = []

    for (const product of data) {
      if (product.d738_exProductManufacturer)
        allSuppliers.push(product.d738_exProductManufacturer)
    }

    uniqueSuppliers = Array.from(new Set(allSuppliers))
    for (const suppliers of uniqueSuppliers) {
      result.push({
        name: suppliers,
        url: transliterateWord(suppliers),
      })
    }

    return result
  }

  public categoryToProductTable(
    products: TDBMJsonGoods[]
  ): TDBMDataCategoryToProduct {
    const result: TDBMDataCategoryToProduct = {} as any

    for (const product of products) {
      const categories: string[] = []

      categories.push(product.d691_exCategory1)
      if (product.d692_exCategory2) categories.push(product.d692_exCategory2)
      if (product.d693_exCategory3) categories.push(product.d693_exCategory3)

      result[product.d721_exProductName] = categories
    }

    return result
  }

  // TODO Refactor withoud any type
  public imagesTable(products: TDBMJsonGoods[]): TDBMDataImages {
    const result: TDBMDataImages = {} as any

    const allImgNameStr = fs
      .readdirSync(StaticFolderService.datasetImgGoodsFolderPath)
      .toString()
      .replace(/,/gm, '\n')

    for (let p of products) {
      const id = p.d720_exProductID
      const regexPreviewImg = new RegExp(`${id}-00\.jpg`, `gmi`)
      const regexBigImg = new RegExp(`${id}-[0-9][1-9]\.jpg`, `gmi`)

      const previewImgArr = allImgNameStr.match(regexPreviewImg)

      const bigImgArr: any = allImgNameStr.match(regexBigImg)
        ? allImgNameStr.match(regexBigImg)
        : ['000-nonePhoto.jpg']

      result[id] = {} as any
      result[id].preview = previewImgArr || [bigImgArr[0]]
      result[id].big = bigImgArr

      // make absolute path to images
      result[id].preview = result[id].preview.map(imgName =>
        path.resolve(StaticFolderService.datasetImgGoodsFolderPath, imgName)
      )
      result[id].big = result[id].big.map(imgName =>
        path.resolve(StaticFolderService.datasetImgGoodsFolderPath, imgName)
      )
    }

    return result
  }

  public statusesTable(products: TDBMJsonGoods[]): string[] {
    const result: string[] = []

    for (const product of products) {
      const status = product.d722_exProductInStock
      result.push(status)
    }

    return Array.from(new Set(result))
  }

  public shopConfigTable(baseInfo: TDBMJsonBaseInfo): TDBMDataShopConfig {
    return {
      title: baseInfo.d582_exShopSiteTitle,
      sub_title: baseInfo.d583_exShopSiteSubTitle,
      id: baseInfo.d580_exShopSiteID,
      base_link: baseInfo.d581_exShopSiteBaseLink,
      address: baseInfo.d584_exShopSiteAddress,
      phone: baseInfo.d585_exShopSitePhone,
      email: baseInfo.d586_exShopSiteEmail,
      pagination_number: baseInfo.d587_exShopSitePaginationNumber,
      currency: baseInfo.d589_exShopSiteCurrency,
      catalog_page: baseInfo.d588_exShopSiteCatalogPage,
      category_number: baseInfo.d590_exShopSiteCategoryNumber,
      copyright: baseInfo.d591_exShopSiteCopyright,
      social_network: baseInfo.d594_exShopSiteSocialNetwork,
      category_cloud_number: baseInfo.d595_exShopSiteCategoryCloudNumber,
      card_view: baseInfo.d601_exShopSiteCardView,
      site_grid_view: baseInfo.d602_exShopSiteGridView,
      site_detail_view: baseInfo.d603_exShopSiteDetailView,
    }
  }

  public customCategoriesTable(
    categoriesNames: string[]
  ): TDBMDataCustomCategories[] {
    return categoriesNames.map(categoryName => {
      return {
        name: categoryName,
        url: transliterateWord(categoryName),
      }
    })
  }

  public customCategoriesProductsTable({
    discount,
    New,
  }: {
    discount: string
    New: string
  }): TDBMDataCustomCategoriesProducts {
    const discountProductsId = splitSemicolon(discount)
    const newProductsId = splitSemicolon(New)
    return {
      discount: discountProductsId,
      New: newProductsId,
    }
  }

  public infoPagesTable(): TDBMDataInfoPages[] {
    const result: TDBMDataInfoPages[] = []
    const pathToContent = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'data',
      'page-content'
    )

    type TPageNames =
      | {
          about: string
          delivery: string
          faqs: string
          main: string
          payment: string
          'public-offer': string
          warranty: string
        }
      | any

    const pageNames: TPageNames = {
      about: 'О магазине',
      delivery: 'Доставка',
      faqs: 'FAQs :: Вопросы-Ответы',
      main: '',
      payment: 'Оплата',
      'public-offer': 'Договор публичной оферты',
      warranty: 'Гарантия',
    }
    const contentFileNames = ['index.md', 'index.html']

    for (const pageUrl in pageNames) {
      const pageName = pageNames[pageUrl]
      const pagePath = path.resolve(pathToContent, pageUrl)
      const imgPath = path.resolve(pathToContent, pageUrl, 'img')

      let content: string = ''
      const img: TDBMDataInfoPagesImg[] | null = []

      // Get file content
      for (const contentFileName of contentFileNames) {
        const filePath = path.resolve(pagePath, contentFileName)
        if (fs.existsSync(filePath)) {
          content = fs.readFileSync(filePath, 'utf8')
        }
      }

      // Get images
      if (fs.existsSync(imgPath)) {
        const imgNames = fs.readdirSync(imgPath)
        for (const imgName of imgNames) {
          img.push({
            name: imgName,
            path: path.resolve(imgPath, imgName),
          })
        }
      }

      result.push({
        name: pageName,
        url: pageUrl,
        img: img.length > 0 ? img : null,
        content,
      })
    }

    return result
  }

  public sliderTable(baseInfo: TDBMJsonBaseInfo): TDBMDataSlider[] {
    const result: TDBMDataSlider[] = []
    const sliderTitles = baseInfo.d592_exShopSiteSliderHeader.split(';\n')
    const pathToImages = FileSystemService.datasetSliderFolderPath
    const sliderImages = fs.readdirSync(pathToImages)

    for (const key in sliderTitles) {
      const sliderTitle = sliderTitles[key]
      const sliderImage = sliderImages[key]
      result.push({
        title: sliderTitle,
        imgPath: path.resolve(pathToImages, sliderImage),
        order_index: Number(key) + 1,
      })
    }

    return result
  }
}

const splitSemicolon = (string: string): string[] => {
  return string.split(';').map(w => w.replace(/\n/, ''))
}

const transliterateWord = (word: string): string => {
  return iuliia.translate(word, iuliia.ICAO_DOC_9303).replace(/ /, '-')
}

export default new PrepareData()
