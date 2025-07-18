import Inventory from "../Models/InventoryModel.js"

export const addProductInInventory = async (req, res) => {
    try{
        const {productName, productCategory, productCost_Wholesale, productCost_Retail, productCost_Distributer, productQuantity, LastShipment} = req.body
        if(!productName || !productCategory || !productCost_Wholesale || !productCost_Retail || !productCost_Distributer || !productQuantity || !LastShipment) {
            return res.status(401).json({
                success: false,
                message: "All fields are mandatory"
            })
        }

        const prod = productName.toLowerCase()
        const product = await Inventory.findOne({productName: prod})

        if(product){
            return res.status(401).json({
                success: false,
                message: "There already exist a product with this name. Please Update the Product"
            })
        }

        await Inventory.create({
            productName: productName.toLowerCase(), productCategory: productCategory.toLowerCase(), productCost_Wholesale, productCost_Retail, productCost_Distributer, productQuantity, LastShipment
        })

        return res.status(201).json({
            success: true,
            message: "Product added Sucessfully"
        })
    } catch(err){
        return res.status(401).json({
            success: false,
            message: "Unable to Add the Product"
        })
    }

}

export const UpdateProductInInventory = async (req,res) => {
    try{
        const {productName, productCategory, productCost_Wholesale, productCost_Retail, productCost_Distributer, productQuantity, LastShipment} = req.body
        if(!productName || !productCategory || !productCost_Wholesale || !productCost_Retail || !productCost_Distributer || !productQuantity || !LastShipment) {
            return res.status(401).json({
                success: false,
                message: "All fields are mandatory"
            })
        }
        const prod = productName.toLowerCase()
        const product = await Inventory.findOne({productName: prod})

        if(!product){
            return res.status(401).json({
                success: false,
                message: "No such Product Exist! Please Add first"
            })
        }

        const isUpdated = await Inventory.findByIdAndUpdate(product._id, {
            productName: prod, productCategory: productCategory.toLowerCase(), productCost_Wholesale, productCost_Retail, productCost_Distributer, productQuantity, LastShipment
        }, {new: true})

        if(!isUpdated){
            return res.status(401).json({
                success: false,
                message: "An Error occured while Updating"
            })
        }

         return res.status(201).json({
                success: true,
                message: "Product Updated Sucessfully"
            })

    } catch(err){
        return res.status(401).json({
            success: false,
            message: "Unable to Update the Product"
        })
    }
}

export const deleteProductInInventory = async (req,res)=>{
    try{
        const {productName} = req.params
        if(!productName){
            return res.status(401).json({
            success: false,
            message: "Product Name is Required"
        })}

        const prod = productName.toLowerCase()
        const product = await Inventory.findOne({productName: prod})

        if(!product){
            return res.status(401).json({
            success: false,
            message: "No such Product Found"
        })}

        await Inventory.deleteOne({productName: prod})

        return res.status(200).json({
            success: true,
            message: "Product Deleted Successfully"
        })
    } catch(err){
        return res.status(401).json({
            success: false,
            message: "Unable to Delete the Product"
        })
    }
}

export const getProductsInInventory = async (req,res)=>{
    try{
        const pages = parseInt(req.query.pages) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (pages - 1) * limit

        const totalProducts = await Inventory.countDocuments()

        const products = await Inventory.find().skip(skip).limit(limit)

        if(!products){
            return res.status(404).json({
            success: false,
            message: "Error Fetching the Data"
        })}

        return res.status(200).json({
            success: true,
            ToatlProducts: totalProducts,
            totalPages: Math.ceil(totalProducts/limit),
            currentPage: pages,
            message: "Results fetched successfully",
            products
        })
    } catch(err){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}