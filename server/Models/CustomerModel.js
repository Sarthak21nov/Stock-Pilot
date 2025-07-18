import mongoose from 'mongoose'

const ConsumerSchema = new mongoose.Schema({
    ConsumerName: {
        type: String,
        required: true
    },
    ConsumerAddress: {
        type: String,
        required: true
    },
    ConsumerType: {
        type: String,
        required: true,
        enum: ['Wholesaler', 'Retailer', 'Distributer']
    },
    OrdersMade: {
        type: Number,
        required: true,
        default: 0
    }
})

const Customer = new mongoose.model("Customer", ConsumerSchema)

export default Customer