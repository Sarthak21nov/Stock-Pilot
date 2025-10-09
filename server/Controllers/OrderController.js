import Customer from "../Models/CustomerModel.js"
import Inventory from "../Models/InventoryModel.js"
import Order from "../Models/OrderModel.js"

export const reqestOrder = async (req, res) => {
  try {
    const { ConsumerName, Products } = req.body;

    // Validate customer
    const customer = await Customer.findOne({ ConsumerName });
    if (!customer)
      return res.status(404).json({ success: false, message: "Customer not found" });

    const orders = [];

    for (const item of Products) {
      const { productName, productQuantity, discountPercentage } = item;

      // Validate product
      const product = await Inventory.findOne({ productName });
      if (!product)
        return res.status(404).json({ success: false, message: `Product '${productName}' not found` });

      if (product.productQuantity < productQuantity)
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${productName}`,
        });

      // Select tier pricing
      let unitCost = 0;
      if (customer.ConsumerType === "Wholesaler") unitCost = product.productCost_Wholesale;
      else if (customer.ConsumerType === "Retailer") unitCost = product.productCost_Retail;
      else if (customer.ConsumerType === "Distributer") unitCost = product.productCost_Distributer;

      const TotalCost = unitCost * productQuantity;
      const NetCost = TotalCost - (TotalCost * (discountPercentage / 100));

      // Create order
      const order = await Order.create({
        OrderName: product.productName,
        ProductCost: unitCost,
        OrderQuantity: productQuantity,
        OrderBy: customer.ConsumerName,
        CustomerId: customer._id,
        TotalCost,
        DiscountPercentage: discountPercentage,
        NetCost,
      });

      // Update inventory
      product.productQuantity -= productQuantity;
      await product.save();

      orders.push(order);
    }

    // Update customer's order count
    customer.OrdersMade += Products.length;
    await customer.save();

    res.status(201).json({
      success: true,
      message: "Orders placed successfully",
      orders,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error placing order",
      error: err.message,
    });
  }
};

export const UpdateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status } = req.body; 

    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.OrderStatus = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: err.message,
    });
  }
};

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