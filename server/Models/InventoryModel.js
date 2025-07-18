import mongoose from 'mongoose'

const InventoryModel = new mongoose.Schema({
    productName: {
        type: String,
        required: true 
    },
    productCategory: {
        type: String,
        required: true
    },
    productCost_Wholesale: {
        type: Number,
        required: true
    },
    productCost_Retail: {
        type: Number,
        required: true
    },
    productCost_Distributer: {
        type: Number,
        required: true
    },
    productQuantity: {
        type: Number,
        required: true
    },
    LastShipment: {
        type: Date,
        required: true
    }
})

const Inventory = new mongoose.model("Inventory", InventoryModel)

export default Inventory;