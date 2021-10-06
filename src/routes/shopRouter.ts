import { Router } from 'express'
import ShopController from '../controllers/ShopController'
const router = Router()

router.get('/config', ShopController.getConfigOrNull)
router.get('/slider', ShopController.getSliderOrNull)

export default router
