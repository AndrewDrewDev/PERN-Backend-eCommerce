import { Router } from 'express'
import InfoController from '../controllers/InfoController'
import checkRoleMiddleware from '../middleware/checkRoleMiddleware'
const router = Router()

router.get('/:id', InfoController.getById)
router.put('/:id', checkRoleMiddleware('ADMIN'), InfoController.updateById)

export default router
