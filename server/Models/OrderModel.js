import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    OrderName: {
        type: String,
        required: true
    }, 
    ProductCost: {
        type: Number,
        required: true
    },
    OrderQuantity: {
        type: Number,
        required: true
    },
    OrderBy: {
        type: String,
        required: true
    },
    CustomerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    TotalCost: {
        type: Number,
        required: true,
    },
    DiscountPercentage: {
        type: Number,
        required: true
    },
    NetCost: {
        type: Number,
        required: true
    },
    OrderDate: {
        type: Date,
        default: Date.now,
        required: true
    }, 
    OrderStatus: {
        type: String,
        required: true,
        enum: ['Placed', 'Preparing For Transit', 'Dispatched', 'Delivered', 'Cannot be processed'],
        default: 'Placed'
    }
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
