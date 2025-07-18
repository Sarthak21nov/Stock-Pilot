import express from 'express'
import { DeleteOrder, getAllOrder, reqestOrder, UpdateData, UpdateOrderStatus } from '../Controllers/OrderController.js'

const router = express.Router()

router.post('/RequestOrder', reqestOrder)
router.get('/getAllOrders', getAllOrder)
router.put('/updateStatus', UpdateOrderStatus)
router.delete('/deleteOrder/:id', DeleteOrder)
router.put('/updateData', UpdateData)

export default router