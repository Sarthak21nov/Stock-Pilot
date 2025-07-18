import Supplier from "../Models/SupplierModel.js"

export const AddSupplier = async (req,res)=>{
    try{
        const { SupplierName, SupplierDealing, SupplierLiscense, LiscenseValidity } = req.body
        if(!SupplierName || !SupplierDealing || !SupplierLiscense || !LiscenseValidity){
            return res.status(404).json({
                success: false,
                message: "All field are mandatory"
            })
        }

        const supplier = await Supplier.findOne({SupplierName})
        if(supplier){
           return res.status(404).json({
                success: false,
                message: "Supplier already exist"
            }) 
        }

        await Supplier.create({
            SupplierName, SupplierDealing, SupplierLiscense, LiscenseValidity
        })

        return res.status(200).json({
            success: true,
            message: "Supplier Added"
        })
    } catch(err){
        return res.status(404).json({
            success: false,
            message: "An error occured while Adding"
        }) 
    }
}

export const UpdateSupplier = async (req,res)=>{
    try{
        const { SupplierName, SupplierDealing, SupplierLiscense, LiscenseValidity } = req.body
        if(!SupplierName || !SupplierDealing || !SupplierLiscense || !LiscenseValidity){
            return res.status(404).json({
                success: false,
                message: "All field are mandatory"
            })
        }

        const supplier = await Supplier.findOne({SupplierName})
        if(!supplier){
            return res.status(404).json({
                success: false,
                message: "Add the supplier first before Updating"
            }) 
        }

        const isUpdated = await Supplier.findByIdAndUpdate(supplier._id, {
            SupplierName, SupplierDealing, SupplierLiscense, LiscenseValidity
        }, {new: true})

        if(!isUpdated){
            return res.status(401).json({
                success: false,
                message: "An Error occured while Updating"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Supplier Data Updated"
        })

    } catch(err){
        return res.status(404).json({
            success: false,
            message: "An error occured while Updating"
        }) 
    }
}

export const DeleteSupplier = async (req,res)=>{
    try{
        const {SupplierName} = req.params
        if(!SupplierName){
            return res.status(401).json({
            success: false,
            message: "Supplier Name is Required"
        })}

        const supplier = await Supplier.findOne({SupplierName})
        if(!supplier){
            return res.status(404).json({
                success: false,
                message: "No Such supplier exist"
            }) 
        }

        await Supplier.deleteOne({SupplierName})

        return res.status(200).json({
            success: true,
            message: "Supplier Deleted"
        })

    } catch(err){
        return res.status(404).json({
            success: false,
            message: "An error occured while Deleting"
        })
    }
}

export const getAllSuppliers = async (req,res) => {
    try{
        const pages = parseInt(req.query.pages) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (pages - 1) * limit

        const totalSuppliers = await Supplier.countDocuments()

        const suppliers = await Supplier.find().skip(skip).limit(limit)

        if(!suppliers){
            return res.status(404).json({
            success: false,
            message: "Error loading the Data"
        })}

        return res.status(200).json({
            success: true,
            message: "Data Fetched Successfully",
            TotalSuppliers: totalSuppliers,
            totalPages: Math.ceil(totalSuppliers / limit),
            suppliers
        })
    } catch(err){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
} 