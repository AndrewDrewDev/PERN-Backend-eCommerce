import { Router } from 'express'
import CategoryController from '../controllers/CategoryController'
const router = Router()

router.get('/', CategoryController.getCategoryProductsOrNull)
router.get('/cloud/:level', CategoryController.getCategoryInfoByLevelOrNull)
router.get('/breadcrumb/:url', CategoryController.getCategoryBreadcrumbOrNull)
router.get('/custom', CategoryController.getCustomCategoryOrNull)
router.get('/custom/:id', CategoryController.getCustomCategoryInfoOrNull)

export default router
