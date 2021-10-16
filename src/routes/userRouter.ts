import { Router } from 'express'
import UserController from '../controllers/UserController'
import authMiddleware from '../middleware/authMiddleware'
const router = Router()

router.post('/login', UserController.login)
router.post('/registration', UserController.registration)
router.get('/auth', authMiddleware, UserController.check)

export default router
