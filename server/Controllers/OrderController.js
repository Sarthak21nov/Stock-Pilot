import Customer from "../Models/CustomerModel.js"
import Inventory from "../Models/InventoryModel.js"
import Order from "../Models/OrderModel.js"

export const reqestOrder = async (req, res) => {
    try {
        const { OrderName, OrderQuantity, OrderBy, DiscountPercentage, OrderStatus } = req.body;

        if (!OrderName || !OrderQuantity || !OrderBy || !DiscountPercentage || !OrderStatus) {
            return res.status(400).json({
                success: false,
                message: "All the fields are mandatory",
            });
        }

        const user = await Customer.findOne({ ConsumerName: OrderBy }); // Assuming 'name' is the field for customer name

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No such Customer exists. Please register the customer.",
            });
        }

        const CustomerId = user._id;
        const role = user.ConsumerType;

        const product = await Inventory.findOne({ productName: OrderName }); // Assuming Inventory has field `productName`

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Required product not found. Please check the inventory.",
            });
        }

        const availableQuantity = product.productQuantity;
        if (availableQuantity < OrderQuantity) {
            return res.status(400).json({
                success: false,
                message: `Required quantity not available. Total units left: ${availableQuantity}`,
            });
        }

        let price = 1000;
        if (role === 'Wholesaler') {
            price = product.productCost_Wholesale;
        } else if (role === 'Retailer') {
            price = product.productCost_Retail;
        } else {
            price = product.productCost_Distributer;
        }

        const totalCost = price * OrderQuantity;
        const netAmount = totalCost - (DiscountPercentage * totalCost / 100);

        await Order.create({
            OrderName,
            ProductCost: price,
            OrderQuantity,
            OrderBy,
            CustomerId,
            TotalCost: totalCost,
            DiscountPercentage,
            NetCost: netAmount,
            OrderStatus
            // OrderDate will be automatically set from schema default (Date.now)
        });

        return res.status(200).json({
            success: true,
            message: "Order requested successfully",
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred.",
        });
    }
};

export const UpdateOrderStatus = async (req,res)=>{
    try{
        const { OrderStatus, id } = req.body
        if(!OrderStatus){
            return res.status(404).json({
                success: false,
                message: "Order Status is Mandatory"
            })
        }

        const isUpdated = await Order.findByIdAndUpdate(id, {OrderStatus: OrderStatus}, {new: true})
        if(!isUpdated){
            return res.status(404).json({
                success: false,
                message: "Error Updating the Data"
            })
        }

        return res.status(200).json({
            success: true, 
            message: "Order Status Updated"
        })

    } catch(err){
        return res.status(500).json({
            success: false,
            message: "An Internal Server Error"
        })
    }
}

export const DeleteOrder = async (req,res)=>{
    try{
        const { id } = req.params

        const deleted = await Order.findByIdAndDelete(id)
        if(!deleted){
            return res.status(404).json({
                success: false,
                message: "Error deleting the Order"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Order Deleted."
        })
    } catch(err){
        return res.status(500).json({
            success: false,
            message: "An Internal Server Error"
        })
    }
}

export const getAllOrder = async (req,res)=>{
    try{
        const orders = await Order.find()
        if(!orders){
            return res.status(404).json({
                success: false,
                message: "Error Fetching the Orders"
            })
        }
        
        return res.status(200).json({
            success: true,
            message: "Fetched Data Successfully",
            data: orders
        }) 
        
    } catch(err){
        return res.status(500).json({
            success: false,
            message: "An Internal Server Error"
        })
    }
}

export const UpdateData = async (req, res) => {
    try{
        const { id, OrderName, OrderQuantity } = req.body

        if(!id || !OrderName || !OrderQuantity){
            return res.status(404).json({
                success: false,
                message: "All Fields are Mandatory"
            })
        }

        const isUpdated = await Order.findByIdAndUpdate(id, {
            OrderName, OrderQuantity
        })

        if(!isUpdated){
            res.status(404).json({
                success: false,
                message: "Error updating"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Data Updated Successfully"
        })
    } catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}