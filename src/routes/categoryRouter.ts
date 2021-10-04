import { Router } from 'express'
import CategoryController from '../controllers/CategoryController'
const router = Router()

router.get('/', CategoryController.getProductsById)
router.get('/cloud/:level', CategoryController.getInfoByLevel)
router.get('/breadcrumb/:url', CategoryController.getBreadcrumb)
router.get('/custom/:id', CategoryController.getCustomProductsInfo)

export default router
