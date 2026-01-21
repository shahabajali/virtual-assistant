import React, { useRef, useState } from 'react'
import { MdOutlineUploadFile } from "react-icons/md";
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/authBg.png"
import image4 from "../assets/image5.png"
import image5 from "../assets/image6.jpeg"
import image6 from "../assets/image7.jpeg"
import { useContext } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";


// import image7 from "../assets/image8.jpeg"




export default function Customize() {
   const{ serverUrl,userData,setUserData ,
    frontendImage, setFrontendImage,
    backendImage,setBackendImage,
    selectImage,setSelectImage
  } =  useContext(userDataContext)
    const inputImage =useRef()
    const navigate =  useNavigate()

    const handleImage=(e)=>{
        const file =  e.target.files[0]
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
}
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black]
     to-[#030353] flex justify-center items-center flex-col'>
        <h1  className=' text-white mb-[40px] text-[30px]  text-center'> Select your
             <span  className=' text-blue-200 text-center '> Assistant Image</span></h1>
            <IoMdArrowBack className=' w-[40px] h-[20px] top-[20px] left-[20px] absolute text-white
             cursor-pointer'onClick={()=> navigate('/')} />
  <div className=' w-[90%] max-w-[80%] flex justify-center items-center  flex-wrap gap-[20px]'>
    <Card  image ={image1}/>
    <Card  image ={image2}/>
    <Card  image ={image3}/>
    <Card  image ={image4}/>
    <Card  image ={image5}/>
    <Card  image ={image6}/>
     <div className={`w-[70px] h-[140px] lg:w-[150px]  lg:h-[250px]  bg-[#030326] border-2 border-[blue-500] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer 
    hover:border-4 hover:border-white 
     flex justify-center items-center ${selectImage == "input"?"border-4 border-white shadow-2xl shadow-blue-950":null} `} onClick={()=> {
        inputImage.current.click()
        setSelectImage("input")
        }}>
        {!frontendImage &&       <MdOutlineUploadFile  className=' w-[20px] h-[30px] text-white'/>}
        {frontendImage && <img  src={frontendImage} 
        className='w-full object-cover'/>}

    </div>
    <input type='file' accept='image/*' ref={inputImage} hidden  onChange={handleImage}/>
      
  </div>
  {selectImage &&   <button className='min-w-[150px] h-[60px] text-black 
  font-semibold bg-white rounded-full text-[20px] mt-8'  onClick={()=> navigate('/customize2') }>Next</button>}

      
    </div>
  )
}
