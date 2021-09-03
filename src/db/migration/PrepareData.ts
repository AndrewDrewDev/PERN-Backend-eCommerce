import {
  TDBMJsonGoods,
  TDBMDataCategories,
  TDBMDataLabels,
  TDBMDataUnits,
} from '../../types'
import transliterateWord from '../../utils/transliterateWord'

class PrepareData {
  public categoriesTable(goods: TDBMJsonGoods[]): TDBMDataCategories[] {
    const allCategories: string[] = []
    const result: TDBMDataCategories[] = []

    for (const product of goods) {
      allCategories.push(product.d691_exCategory1)
      if (product.d692_exCategory2) allCategories.push(product.d692_exCategory2)
      if (product.d693_exCategory3) allCategories.push(product.d693_exCategory3)
    }

    let uniqueCategories: string[] = Array.from(new Set(allCategories))
    for (const category of uniqueCategories) {
      result.push({
        name: category,
        url: transliterateWord(category),
      })
    }

    return result
  }

  // TODO: Add lables tables to excel
  public labelsTable(): TDBMDataLabels[] {
    const result: TDBMDataLabels[] = []
    const labels = ['Акции', 'Новинки']

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

  public tagsTable(data: TDBMJsonGoods[]) {}
  public suppliersTable(data: TDBMJsonGoods[]) {}
  public productsTable(data: TDBMJsonGoods[]) {}
  public categoryTable(data: TDBMJsonGoods[]) {}
  public tagTable(data: TDBMJsonGoods[]) {}
  public infoTable(data: TDBMJsonGoods[]) {}
  public propertiesTable(data: TDBMJsonGoods[]) {}
}

export default new PrepareData()
