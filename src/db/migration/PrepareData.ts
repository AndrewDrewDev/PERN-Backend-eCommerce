import {
  TDBMJsonGoods,
  TDBMDataCategories,
  TDBMDataLabels,
  TDBMDataUnits,
  TDBMDataSuppliers,
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
}

export default new PrepareData()
