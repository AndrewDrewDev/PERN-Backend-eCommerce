import { Router } from 'express'
import ProductController from '../controllers/ProductController'
import checkRoleMiddleware from '../middleware/checkRoleMiddleware'
const router = Router()

router.get('/:id', ProductController.getOneById)
router.put(
  '/:id',
  checkRoleMiddleware('ADMIN'),
  ProductController.updateOneById
)
router.get('/search/:name', ProductController.getSearchByName)

router.get('/info/labels', ProductController.getLabels)
router.get('/info/statuses', ProductController.getStatuses)
router.get('/info/suppliers', ProductController.getSuppliers)
router.get('/info/units', ProductController.getUnits)

export default router
