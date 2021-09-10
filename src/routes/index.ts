import Router from 'express'
import productRouter from './productRouter'
const router = Router()

router.use('/product', productRouter)

export default router
