import Customer from "../Models/CustomerModel.js"

export const AddCustomer = async (req,res)=>{
    try{
        const { ConsumerName, ConsumerAddress, ConsumerType, OrdersMade } = req.body
        if(!ConsumerName || !ConsumerAddress || !ConsumerType || typeof OrdersMade !== "number"){
            return res.status(404).json({
                success: false,
                message: "All field are mandatory"
            })
        }

        const customer = await Customer.findOne({ConsumerName})
        if(customer){
            return res.status(404).json({
                success: false,
                message: "Customer Already Exist"
            })
        }

        await Customer.create({
            ConsumerName, ConsumerAddress, ConsumerType, OrdersMade
        })

        return res.status(200).json({
                success: true,
                message: "Customer Added"
            })
    } catch(err){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }

}

export const DeleteCustomer = async (req,res)=>{
    try{
        const {ConsumerName} = req.params
        if(!ConsumerName){
            return res.status(404).json({
            success: false,
            message: "Customer Name is Mandatory"
        })}

        const customer = await Customer.findOne({ConsumerName})
        if(!customer){
            return res.status(404).json({
            success: false,
            message: "No Such Customer Exist"
        })}

        const isDeleted = await Customer.deleteOne({ConsumerName})
        if(isDeleted){
            return res.status(200).json({
            success: true,
            message: "Customer Deleted"
        })} else{
            return res.status(404).json({
            success: false,
            message: "An error occurred"
        })
        }
    } catch(err){
        return res.status(500).json({
            success: false,
            message: "An Error occurred while deleting"
        })
    }
}

export const UpdateCustomer = async (req,res)=>{
    try{
        const {ConsumerName, ConsumerAddress, ConsumerType, OrdersMade} = req.body
        if(!ConsumerName || !ConsumerAddress || !ConsumerType || typeof OrdersMade !== "number"){
            return res.status(404).json({
            success: false,
            message: "All the Data are mandatory"
        })}

        const customer = await Customer.findOne({ConsumerName})
        if(!customer){
            return res.status(404).json({
                success: false,
                message: "No Such Customer Exist"
            })    
        }

        const isUpdated = await Customer.findByIdAndUpdate(customer._id, {
            ConsumerName, ConsumerAddress, ConsumerType, OrdersMade
        }, {new: true})

        if(!isUpdated){
            return res.status(404).json({
                success: false,
                message: "An Error Occurred"
            })
        }

        return res.status(404).json({
                success: true,
                message: "Customer Data Updated"
            })
    } catch(err){
        return res.status(500).json({
                success: false,
                message: "An Error Occurred while Updating"
            })
    }
}

export const getCustomer = async (req,res)=>{
    try{
        const page = parseInt(req.query.pages) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit

        const totalCustomers = await Customer.countDocuments()

        const customers = await Customer.find().skip(skip).limit(limit)

        if(!customers){
            return res.status(404).json({
                success: false,
                message: "Unable fetching Customers"
            })
        }

        return res.status(200).json({
            success: true,
            TotalCustomers: totalCustomers,
            totalPages: Math.ceil(totalCustomers/limit),
            currentPage: page,
            message: "Data Fetched successfully",
            customers
        })
    } catch(err){
        return res.status(500).json({
                success: false,
                message: "An Error Occurred while fetching"
            })
    }
}