import express from 'express'
import { DeleteOrder, getAllOrder, reqestOrder, UpdateData, UpdateOrderStatus } from '../Controllers/OrderController.js'
import { SalesProtect, WarehouseProtect } from '../Utils/protect.js'

const router = express.Router()

router.post('/RequestOrder', SalesProtect, reqestOrder)  
router.get('/getAllOrders', getAllOrder)
router.put('/updateStatus', WarehouseProtect, UpdateOrderStatus)  
router.delete('/deleteOrder/:id', DeleteOrder)
router.put('/updateData', UpdateData)

export default router