import Router from 'express'
import productRouter from './productRouter'
import categoryRouter from './categoryRouter'
const router = Router()

router.use('/product', productRouter)
router.use('/category', categoryRouter)

export default router
