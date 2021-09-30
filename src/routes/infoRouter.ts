import { Router } from 'express'
import InfoController from '../controllers/InfoController'
const router = Router()

router.get('/', InfoController.getInfoData)

export default router
