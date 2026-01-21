////////////////////////////////////////
import React, { useContext, useState } from 'react';
import { IoEyeSharp } from "react-icons/io5";
import { HiMiniEyeSlash } from "react-icons/hi2";
import bg from '../assets/authBg.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userDataContext } from '../context/UserContext'; // only this import needed

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl,userData,setUserData} = useContext(userDataContext); // gets value from provider
  const [err,setErr] =  useState("");


  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading] =  useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      let result = await axios.post(`${serverUrl}/api/auth/signin`, {
         email, password
      }, { withCredentials: true });
       setUserData(result.data)
          setLoading(false);
          setEmail("");
          setPassword("");
    } catch (error) {
      console.log(error);
      setUserData(null)
      setErr(error.response.data.message)
      setLoading(false);
      navigate("/")
         setEmail("");
          setPassword("");
    }
  };

  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }}>
      <form className='w-[90%] h-[600px] max-w-[500px] bg-black/20 shadow-black backdrop-blur flex flex-col items-center justify-center gap-[20px] px-[20px]' onSubmit={handleSignIn}>
        
        <h1 className='text-white text-[20px] sm:text-[20px] font-semibold  md-[40px]  '>
         Welcom to Virtual assistance
        </h1>
        <span className="text-blue-500 text-[30px] "> Signin page </span>

       

        <input type='text' placeholder='Enter your email'
          className='w-full h-[60px] border-2 border-white bg-transparent rounded-full text-white placeholder-gray-300 outline-none text-[20px] px-[20px] py-[10px]'
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email} />

        <div className='w-full h-[60px] relative'>
          <input type={showPassword ? 'text' : 'password'} placeholder='Enter your password'
            className='w-full h-[60px] border-2 border-white bg-transparent rounded-full text-white placeholder-gray-300 outline-none text-[20px] px-[20px] py-[10px]'
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password} />

          {!showPassword && (
            <IoEyeSharp
              className='absolute top-[22px] right-[20px] text-white w-[30px] h-[20px] cursor-pointer'
              onClick={() => setShowPassword(true)}
            />
          )}
          {showPassword && (
            <HiMiniEyeSlash
              className='absolute top-[22px] right-[20px] text-white w-[30px] h-[20px] cursor-pointer'
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>
        {err.length > 0 && <p  className='text-red-500 text-[17px]'>
          *{err}</p>}

        <button className='min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[20px] mt-8' disabled = {loading}>
          {loading?"Loading":"Sign In"}
        </button>

        <p className='text-white text-[20px] cursor-pointer'>
          Want to create new account ?
          <span className='text-blue-400 px-[5px]' onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}