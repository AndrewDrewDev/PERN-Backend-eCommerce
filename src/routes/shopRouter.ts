import { Router } from 'express'
import ShopController from '../controllers/ShopController'
import checkRoleMiddleware from '../middleware/checkRoleMiddleware'
const router = Router()

router.get('/config', ShopController.getConfig)
router.put('/config', checkRoleMiddleware('ADMIN'), ShopController.updateConfig)

router.get(
  '/custom_category_products',
  ShopController.getCustomCategoryProducts
)

router.get('/slider', ShopController.getSlider)

export default router
