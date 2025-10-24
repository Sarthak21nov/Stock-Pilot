import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import AuthRouter from './Routes/AuthRouter.js'
import AdminRouter from './Routes/AdminRouter.js'
import OrderRouter from './Routes/OrderRouter.js'
import AdminRoutes from './Routes/AdminRoutes.js'

dotenv.config()

const server = express()
const PORT = process.env.PORT || 5000

// Database
const connect = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to DB")
    } catch (err){
        console.error("DB Connection Error:", err)
    }
}

mongoose.connection.on("disconnected", ()=>{
    console.log("Disconnected from DB")
})

// IMPORTANT: Apply middleware in this exact order
server.use(cookieParser())
server.use(express.json())
server.use(express.urlencoded({extended: true}))

// CORS - Must come AFTER body parsers
const allowedOrigins = [
  'https://stock-pilot-4oj8.vercel.app',
  'https://main.d3sgipjjeevgzg.amplifyapp.com',
  'http://localhost:5173'
];

server.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Routes
server.use('/api/auth', AuthRouter)
server.use('/api/admin', AdminRouter)
server.use('/api/order', OrderRouter)
server.use('/api/manipulation', AdminRoutes)

// Connect to database
connect();

// Only listen when running locally
if (!process.env.VERCEL) {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    });
}

export default server;
