import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import AuthRouter from '../server/Routes/AuthRouter.js'
import AdminRouter from '../server/Routes/AdminRouter.js'
import OrderRouter from '../server/Routes/OrderRouter.js'
import AdminRoutes from '../server/Routes/AdminRoutes.js'

dotenv.config()

const server = express()
const PORT = process.env.PORT || 5000

// Database
const connect = async ()=>{
    try{
        mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to DB")
    } catch (err){
        throw(err)
    }
}

mongoose.connection.on("disconnected", ()=>{
    console.log("Disconnected from DB")
})

// Middleware
const corsOptions = {
  // origin: 'http://localhost:5173', 
  origin: ['https://stock-pilot-4oj8.vercel.app','https://main.d3sgipjjeevgzg.amplifyapp.com', 'http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

server.use(cors(corsOptions));
server.options('*', cors(corsOptions));

server.use(cookieParser())
server.use(express.json())
server.use(express.urlencoded({extended: true}))


// Routes
server.use('/api/auth', AuthRouter)
server.use('/api/admin', AdminRouter)
server.use('/api/order', OrderRouter)
server.use('/api/manipulation', AdminRoutes)

server.listen(PORT, ()=>{
    connect()
    console.log(`Server Running on Port ${PORT}`)
})
