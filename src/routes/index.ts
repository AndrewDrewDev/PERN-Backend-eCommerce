import Router from 'express'
import productRouter from './productRouter'
import categoryRouter from './categoryRouter'
import shopRouter from './shopRouter'
import infoRouter from './infoRouter'
const router = Router()

router.use('/shop', shopRouter)
router.use('/product', productRouter)
router.use('/category', categoryRouter)
router.use('/info', infoRouter)

export default router
