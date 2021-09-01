import { TDBMJsonGoods, TDBMDataCategories, TDBMDataLabels } from '../../types'
import transliterateWord from '../../utils/transliterateWord'

class PrepareData {
  public categoriesTable(goods: TDBMJsonGoods[]): TDBMDataCategories[] {
    const result: TDBMDataCategories[] = []

    const productItem = (name: string): TDBMDataCategories => {
      return {
        name,
        url: transliterateWord(name),
      }
    }

    for (const product of goods) {
      result.push(productItem(product.d691_exCategory1))
      result.push(productItem(product.d692_exCategory2))
      result.push(productItem(product.d693_exCategory3))
    }

    return Array.from(new Set(result))
  }

  // TODO: Add table tabls
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
  public tagsTable(data: TDBMJsonGoods[]) {}
  public unitsTable(data: TDBMJsonGoods[]) {}
  public suppliersTable(data: TDBMJsonGoods[]) {}
  public productsTable(data: TDBMJsonGoods[]) {}
  public categoryTable(data: TDBMJsonGoods[]) {}
  public tagTable(data: TDBMJsonGoods[]) {}
  public infoTable(data: TDBMJsonGoods[]) {}
  public propertiesTable(data: TDBMJsonGoods[]) {}
}

export default new PrepareData()
