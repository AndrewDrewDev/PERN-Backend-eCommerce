import { Router } from 'express'
import CategoryController from '../controllers/CategoryController'
const router = Router()

router.get('/', CategoryController.getProductsById)
router.put('/:id', CategoryController.updateCategoryById)
router.get('/info/cloud/:level', CategoryController.getInfoByLevel)
router.get('/breadcrumb/:url', CategoryController.getBreadcrumb)
router.get('/info/custom/:id', CategoryController.getCustomProductsInfo)
router.get('/info/all/', CategoryController.getAllProductsInfo)

export default router
