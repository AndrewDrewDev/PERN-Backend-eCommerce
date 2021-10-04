import { Router } from 'express'
import InfoController from '../controllers/InfoController'
const router = Router()

router.get('/:id', InfoController.getById)

export default router
