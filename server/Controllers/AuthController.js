import User from "../Models/AuthModel.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const login = async (req, res)=>{
    try{
        const { email, password } = req.body
        if( !email || !password ){
            return res.status(400).json({
                success: false,
                message: "Both the fields are Required"
            })
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success: false,
                message: "No User exist with this Email ID."
            })
        }

        const correctPassword = await bcrypt.compare(password, user.password);
        if(!correctPassword){
            return res.status(400).json({
                success: false,
                message: "Incorrect Email ID or Password"
            })
        }

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET_KEY, {expiresIn: '1d'})
        const userRole = user.role

        return res.cookie(`${userRole}Token` ,token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 24*60*60*1000
        }).status(200).json({
            success: true,
            message: "Logged In Sucessfully",
            role: user.role
        })
    } catch(err){
        return res.status(400).json({
            success: false,
            message: "Incorrect Email ID or Password"
        }) 
    }

}

export const register = async (req, res)=>{
    try{
        const { name, email, password, role } = req.body
        if(!name || !email || !password || !role){
            return res.status(400).json({
                success: false,
                message: "Both the fields are Required"
            })
        }

        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({
                success: false,
                message: "User Already Exist with the Email ID"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role
        })

        return res.status(200).json({
            success: true,
            message: "Registration Complete Successfully. You will be noe redirected to login page"
        })

    } catch(err){
        console.log(err)
        return res.status(401).json({
            success: false,
            message: "An Unknown error occurred",
        })
    }
}
