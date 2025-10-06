import express from 'express'
import { AdminProtect } from '../Utils/protect.js'
import { addProductInInventory, deleteProductInInventory, getProductsInInventory, UpdateProductInInventory } from '../Controllers/InventoryController.js'
import { AddSupplier, DeleteSupplier, getAllSuppliers, UpdateSupplier } from '../Controllers/SupplierController.js'
import { AddCustomer, DeleteCustomer, getCustomer, UpdateCustomer } from '../Controllers/CustomerController.js'

const router = express.Router()

// Inventory Routers
router.post('/addProduct', AdminProtect, addProductInInventory)
router.put('/updateProduct', UpdateProductInInventory)
router.get('/getProducts', getProductsInInventory)
router.delete('/deleteProduct/:productName', AdminProtect, deleteProductInInventory)

// Supplier Routers
router.post('/addSupplier', AdminProtect, AddSupplier)
router.put('/updateSupplier', AdminProtect, UpdateSupplier)
router.delete('/deleteSupplier/:SupplierName', AdminProtect, DeleteSupplier)
router.get('/getSuppliers', AdminProtect, getAllSuppliers)

// Customers Routers
router.post('/AddCustomer', AdminProtect, AddCustomer)
router.put('/updateCustomer', AdminProtect, UpdateCustomer)
router.delete('/deleteCustomer/:ConsumerName', AdminProtect, DeleteCustomer)
router.get('/getCustomer', getCustomer)


export default router   