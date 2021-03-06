import { Router } from 'express'
import ProductController from '../controllers/ProductController'
import checkRoleMiddleware from '../middleware/checkRoleMiddleware'
const router = Router()

router.get('/:id', ProductController.getOneById)
router.put(
  '/update/info/:id',
  checkRoleMiddleware('ADMIN'),
  ProductController.updateOneInfoById
)

router.post(
  '/add/img/:id',
  checkRoleMiddleware('ADMIN'),
  ProductController.addImageById
)

router.delete(
  '/delete/img/:imgName',
  checkRoleMiddleware('ADMIN'),
  ProductController.deleteImageByName
)

router.put(
  '/update/img',
  checkRoleMiddleware('ADMIN'),
  ProductController.updateImage
)

router.put(
  '/update/order-img',
  checkRoleMiddleware('ADMIN'),
  ProductController.updateOrderImages
)
router.get('/list/search/:name', ProductController.getSearchByName)
router.get('/list/info/labels', ProductController.getLabels)
router.get('/list/info/statuses', ProductController.getStatuses)
router.get('/list/info/suppliers', ProductController.getSuppliers)
router.get('/list/info/units', ProductController.getUnits)

export default router
