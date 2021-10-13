import { Router } from 'express'
import ProductController from '../controllers/ProductController'
const router = Router()

router.get('/:id', ProductController.getOneById)
router.get('/search/:name', ProductController.getSearchProductsByName)

export default router
