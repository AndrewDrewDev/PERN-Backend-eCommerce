import { Router } from 'express'
import ShopController from '../controllers/ShopController'
const router = Router()

router.get('/config', ShopController.getConfig)
router.get('/slider', ShopController.getSlider)

export default router
