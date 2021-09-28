import { Router } from 'express'
import CategoryController from '../controllers/CategoryController'
const router = Router()

router.get('/', CategoryController.getCategoryProductsOrNullIfNotExist)
router.get(
  '/cloud/:level',
  CategoryController.getCategoryInfoByLevelOrNullIfNotExist
)
router.get(
  '/breadcrumb/:url',
  CategoryController.getCategoryBreadcrumbOrNullIfNotExist
)

export default router
