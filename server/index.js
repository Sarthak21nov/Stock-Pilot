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
    origin: function(origin, callback) {
      const allowedOrigins = [
        'https://stock-pilot-4oj8.vercel.app',
        'https://main.d3sgipjjeevgzg.amplifyapp.com',
        'http://localhost:5173'
      ];
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
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

// server.listen(PORT, ()=>{
//     connect()
//     console.log(`Server Running on Port ${PORT}`)
// })

if (process.env.NODE_ENV !== "production") {
    server.listen(PORT, () => {
      connect();
      console.log(`Server running on port ${PORT}`);
    });
}


export default server;