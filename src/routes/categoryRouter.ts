import { Router } from 'express'
import CategoryController from '../controllers/CategoryController'
const router = Router()

router.get('/', CategoryController.getCategoryProducts)
router.get('/cloud/:level', CategoryController.getCategoryInfoByLevel)

export default router
