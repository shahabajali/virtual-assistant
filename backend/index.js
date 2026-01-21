import express from 'express';
import dotenv from 'dotenv'
dotenv.config();
import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from'cors'
import userRouter from './routes/user.routes.js';
import geminiResponse from './gemini.js';

const app  = express();


// console.log(" dot env" ,dotenv.config)
const port =  process.env.PORT||5000;
app.use(express.json());//  midleware for convert backend data in  json format
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());



// midleware for routers
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
// console.log(data);
app.get("/",async(req,res)=>{
let result =  await geminiResponse();
   res.json(result)
})
app.listen(port,()=>{
    connectDb();
    console.log(" server is start",port);
})

