import mongoose from "mongoose"

 const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("db connected")
    } catch (error) {
         console.log("errors",error);
    }
 }
 export default connectDb;