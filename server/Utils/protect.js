import jwt from 'jsonwebtoken'

export const AdminProtect = (req, res, next) => {
    
    const { adminToken } = req.cookies

    if(!adminToken){
        return res.status(401).json({
            success: false,
            message: "Invalid Access! Please login as Admin to continue"
        })
    }

    try{
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET_KEY)
        console.log(decoded)
        req.user = decoded.id 
        next()
    } catch(err){
        return res.status(401).json({
            success: false,
            message: "Unauthorized Access"
        })
    }

}

export const SalesProtect = (req, res, next) => {
    const { salesToken } = req.cookies

    if(!salesToken){
        return res.status(401).json({
            success: false,
            message: "Unauthorized Access"
        })
    }

    try{
        const decoded = jwt.verify(salesToken, process.env.JWT_SECRET_KEY)
        req.user = decoded.id 
        next()
    } catch(err){
        return res.status(401).json({
            success: false,
            message: "An error occurred while verifying token"
        })
    }
}

export const WarehouseProtect = (req, res, next) => {
    const { warehouseToken } = req.cookies

    if(!warehouseToken){
        return res.status(401).json({
            success: false,
            message: "Unauthorized Access"
        })
    }

    try{
        const decoded = jwt.verify(warehouseToken, process.env.JWT_SECRET_KEY)
        req.user = decoded.id 
        next()
    } catch(err){
        return res.status(401).json({
            success: false,
            message: "An error occurred while verifying token"
        })
    }
}