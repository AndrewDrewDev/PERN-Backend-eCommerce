import { Router } from 'express'
import CategoryController from '../controllers/CategoryController'
const router = Router()

router.get('/', CategoryController.getCategoryProductsOrNull)
router.get('/cloud/:level', CategoryController.getCategoryInfoByLevelOrNull)
router.get('/breadcrumb/:url', CategoryController.getCategoryBreadcrumbOrNull)
router.get('/custom/:url', CategoryController.getCustomCategoryOrNull)

export default router
