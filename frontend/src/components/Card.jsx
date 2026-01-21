import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

export default function Card({image}) {
      const{ serverUrl,userData,setUserData ,
        frontendImage, setFrontendImage,
        backendImage,setBackendImage,
        selectImage,setSelectImage
      } =  useContext(userDataContext)
  return (
    <div className={`w-[70px] h-[140px] lg:w-[150px]  lg:h-[250px]  bg-[#030326] border-2 border-blue-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer 
    hover:border-4 hover:border-white ${selectImage == image?"border-4 border-white shadow-2xl shadow-blue-950":null}`} 
    onClick={()=>{setSelectImage(image)
      setBackendImage(null);
      setFrontendImage(null)  
    }}>
      <img src={image} className='h-full object-cover'/>
    </div>
  )
}
