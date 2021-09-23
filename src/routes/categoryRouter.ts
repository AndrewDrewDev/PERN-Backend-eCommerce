import { Router } from 'express'
import CategoryController from '../controllers/CategoryController'
const router = Router()

router.get('/', CategoryController.getCategoryProducts)
router.get('/cloud/:level', CategoryController.getCategoryInfoByLevel)
router.get('/breadcrumb/:url', CategoryController.getCategoryBreadcrumb)

export default router
