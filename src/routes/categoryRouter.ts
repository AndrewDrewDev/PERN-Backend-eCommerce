import { Router } from 'express'
import CategoryController from '../controllers/CategoryController'
import checkRoleMiddleware from '../middleware/checkRoleMiddleware'
const router = Router()

router.get('/products', CategoryController.getProductsById)
router.put(
  '/item/:id',
  checkRoleMiddleware('ADMIN'),
  CategoryController.updateCategoryById
)
router.put(
  '/order',
  checkRoleMiddleware('ADMIN'),
  CategoryController.updateOrder
)
router.get('/info/cloud/:level', CategoryController.getInfoByLevel)
router.get('/breadcrumb/:url', CategoryController.getBreadcrumb)
router.get('/info/custom/:id', CategoryController.getCustomProductsInfo)
router.get('/info/all/', CategoryController.getAllProductsInfo)

export default router
