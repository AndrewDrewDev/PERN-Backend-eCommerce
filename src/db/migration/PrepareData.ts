import {
  TDBMDataLabels,
  TDBMDataSuppliers,
  TDBMDataUnits,
  TDBMJsonGoods,
  TDBMJsonGoodsRaw,
} from '../../types'
import transliterateWord from '../../utils/transliterateWord'

class PrepareData {
  private categoryToArray(product: TDBMJsonGoodsRaw): string[] {
    const result: string[] = []

    result.push(product.d691_exCategory1)
    if (product.d692_exCategory2) result.push(product.d692_exCategory2)
    if (product.d693_exCategory3) result.push(product.d693_exCategory3)

    return result
  }

  private setLabel(product: TDBMJsonGoodsRaw): 'Акция' | 'Новинка' | '' {
    if (product.d734_exProductNew) return 'Новинка'
    if (product.d735_exProductDiscounts) return 'Акция'
    return ''
  }

  public productsData(goods: TDBMJsonGoodsRaw[]): TDBMJsonGoods[] {
    const result: TDBMJsonGoods[] = []

    for (const p of goods) {
      result.push({
        categories: this.categoryToArray(p),
        id: p.d720_exProductID,
        name: p.d721_exProductName,
        label: this.setLabel(p),
        property: '',
        price: p.d802_exPriceSell,
        oldPrice: p.d803_exPriceOldSell,
        unit: p.d781_exEd,
        description: p.d723_exProductDescription,
        amount: p.d748_exProductAmountRemaind,
        inStock: p.d722_exProductInStock,
        vendorId: p.d747_exProductCodeVender,
        supplier: p.d738_exProductManufacturer,
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

  public unitsTable(data: TDBMJsonGoodsRaw[]): TDBMDataUnits[] {
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

  public suppliersTable(data: TDBMJsonGoodsRaw[]): TDBMDataSuppliers[] {
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
