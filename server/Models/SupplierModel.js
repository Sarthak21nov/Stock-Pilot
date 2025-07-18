import mongoose from 'mongoose'

const SupplierModel = new mongoose.Schema({
    SupplierName: {
        type: String,
        required: true
    },
    SupplierDealing: {
        type: String,
        required: true
    },
    SupplierLiscense: {
        type: String,
        required: true
    },
    LiscenseValidity: {
        type: Date,
        required: true
    },
})

const Supplier = new mongoose.model("Supplier", SupplierModel)

export default Supplier;