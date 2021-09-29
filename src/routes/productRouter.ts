import { Router } from 'express'
import ProductController from '../controllers/ProductController'
const router = Router()

router.get('/:id', ProductController.getOneOrNull)

export default router
