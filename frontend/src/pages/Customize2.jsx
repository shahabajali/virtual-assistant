import React, { useContext } from 'react'
import {userDataContext} from '../context/UserContext'
import{useState } from 'react';
import axios from 'axios';
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';


export default function Customize2() {
    const{userData ,backendImage,
         selectImage,serverUrl,setUserData} = useContext(userDataContext);
         const navigate = useNavigate()
    
 
    
   const[assistantName,setAssistantName] =  useState(
        userData?.assistantName || "")
        const[loading,setLoading] =  useState(false);
      //  fetch updateassaistant api
      const handleUpdateAssistant =  async()=>{
           setLoading(true);
        try {
            let formData =new FormData();
            formData.append("assistantName",assistantName)
            if(backendImage){
                formData.append("assistantImage",backendImage)
            }else{
                formData.append("imageUrl",selectImage);
            }
            const result =  await axios.post(`${serverUrl}/api/user/update`
            , formData,{withCredentials:true})
           
            console.log(result.data);
            setUserData(result.data)
            setLoading(false);
              navigate('/');
           
         
        } catch (error) {
            console.log(error)
             setLoading(false);
           
        }
      }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black]
     to-[#030353] flex justify-center items-center flex-col relative'>
         <h1  className=' text-white mb-[40px] text-[30px]'> Enter Your
             <span  className=' text-blue-200'> Assistant Name</span></h1>
             <IoMdArrowBack className=' w-[40px] h-[20px] top-[20px] left-[20px] absolute text-white
             cursor-pointer 'onClick={()=> navigate('/customize')} />

       <input type='text' placeholder='Eg.shira'
          className=' w-full  max-w-[600px] h-[60px] border-2 border-white bg-transparent rounded-full text-white placeholder-gray-300 outline-none text-[20px] px-[20px] py-[10px]'
          required
          onChange={(e)=> setAssistantName(e.target.value)}
          value={assistantName}
          />
        {assistantName &&<button className='min-w-[300px] h-[60px] text-black 
  font-semibold bg-white rounded-full text-[20px] mt-8'disabled={loading}  onClick={()=> handleUpdateAssistant() }>{loading?"Loading...":"Finally Create AssistantName"
  }</button>}
        
      
    </div>
  )
}
