///////////////////////////////////////////////////////////////////////////////
//
// Prefix abbreviation Controllers types explain:
// T - type
// C - controllers
// M - model

import { TDBMDataCategories } from './db/types'

export type TCResponseMessage = {
  code?: number
  status: 'OK' | 'FAILED'
  message?: string
}

export type TCMProductFullInfo = {
  categories: TDBMDataCategories[]
  images: { preview: string; big: string[] }
  name: string
  label: string
  unit: string
  supplier: string
  id: string
  description: string
  price: string
  old_price: string
  amount: string
  vendor_id: string
  status: string
}

export type TCMProductsByCategoryData = {
  count: number
  name: string
  id: string
  price: string
  old_price: string
  status: string
  label: string
  img: string
}

export type TCMShopControllerGetSlider = {
  title: string
  img: string
}

export type TCMGetSearchProductsByName = {
  name: string
  id: string
  price: string
  img: string
}

export type TCMGetInfoByLevel = {
  count: number
  name: string
  url: string
  img: string | null
}

export type TCMGetBreadcrumb = {
  name: string
  url: string
}

export type TCMGetInfoData = {
  name: string
  url: string
  content: string
  img: string[] | null
}

export type TUserAuthType = 'ADMIN' | 'USER'

export type TCMGetCustomCategoryProducts = {
  category_name: string
  category_url: string
  name: string
  id: string
  img: string
}[]

export type TCMUpdateOrderImages = {
  name: string
  order: number
}

export type TCMFilterParamsRaw = {
  price: string
  supplier: string
  label: string
}

export type TCMFilterParams = {
  price: { min: string; max: string }
  supplier: string[]
  label: string[]
}

export type TCMGetProductsFiltersInfo = {
  price: { min: string; max: string } | null
  labels: { id: number; name: string }[] | null
  suppliers: { id: number; name: string }[] | null
}
