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
// TODO: Add
// router.get('/labels/:id', ProductController.getLabelsById)
// router.get('/statuses/:id', ProductController.getStatusesById)
// router.get('/suppliers/:id', ProductController.getSuppliersById)
// router.get('/units/:id', ProductController.getunitsById)

export default router
