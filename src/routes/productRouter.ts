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
router.put(
  '/update/img',
  checkRoleMiddleware('ADMIN'),
  ProductController.updateOneImgById
)
router.get('/list/search/:name', ProductController.getSearchByName)
router.get('/list/info/labels', ProductController.getLabels)
router.get('/list/info/statuses', ProductController.getStatuses)
router.get('/list/info/suppliers', ProductController.getSuppliers)
router.get('/list/info/units', ProductController.getUnits)

export default router
