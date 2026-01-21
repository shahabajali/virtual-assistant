// import genToken from "../config/token.js";
// import User from "../models/user.model.js";
// import bcrypt from'bcryptjs'

import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // email check
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be 6+ characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // generate token
    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });

    return res.status(201).json(user);
  } catch (error) {
    console.log("signup error", error);
    return res.status(500).json({ message: `Signup error: ${error.message}` });
  }
};


 // Login 
 export const  Login=  async(req,res)=>{
    try {
        const { email, password } =  req.body;
        // email validation 
         
     const  user=    await User.findOne({email});
     if(!user){
        return res.status(400).json({message:"email dose not exits !"})
     }

     const isMatch =    await bcrypt.compare(password,user.password);
     if( !isMatch){
      return res.status(400).json({message:"  password i incorrect !"})
     }
       
        // token genrate
        const token =  await genToken(user._id)
        res.cookie("token",token,{
         httpOnly:true,
         maxAge:7*24*60*60*1000,
         sameSite:"strict",
         secure:false
        })
        return res.status(200).json(user)

        
    } catch (error) {
      return res.status(500).json({message:` Login  error ${error}`})  
    }
 };

 //  logout 
 export const logOut =  async(req,res)=>{
   try{
      res.clearCookie("token")
       return res.status(200).json({message:"logOut   Successfully !"})
      
   } catch (error) {
      return res.status(500).json({message:` logOut  error ${error}`}) 
   }
 }