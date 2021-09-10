import { Router } from 'express'
import ProductController from '../controllers/productController'
const router = Router()

router.get('/:id', ProductController.getOne)

export default router
