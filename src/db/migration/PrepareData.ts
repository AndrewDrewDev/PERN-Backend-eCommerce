import iuliia from 'iuliia'

import {
  TDBMDataCategoriesItem,
  TDBMDataCategoryToProduct,
  TDBMDataLabels,
  TDBMDataSuppliers,
  TDBMDataUnits,
  TDBMJsonGoods,
} from '../../types'

class PrepareData {
  public categoriesTable(goods: TDBMJsonGoods[]): TDBMDataCategoriesItem[] {
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
}

const transliterateWord = (word: string): string => {
  return iuliia.translate(word, iuliia.ICAO_DOC_9303).replace(/ /, '-')
}

export default new PrepareData()
