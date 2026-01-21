import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

export const userDataContext = createContext();

export default function UserContext({ children }) {
  const serverUrl = "http://localhost:8000"; // your API base URL
  const [userData,setUserData] =  useState();
   const [frontendImage, setFrontendImage] =  useState(null);
      const[backendImage,setBackendImage] = useState(null)
      const[selectImage,setSelectImage] =  useState(null)

  const handleCurrentUser = async()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
        setUserData(result.data)
        console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  } 

  //get gemini response
  const getGeminiRespose = async(command)=>{
    try {
      const result = await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
        return result.data
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(()=>{
    handleCurrentUser();
  },[])
  const value = {serverUrl,userData,setUserData ,
    frontendImage, setFrontendImage,
    backendImage,setBackendImage,
    selectImage,setSelectImage,
    getGeminiRespose
  };

  return(
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}


///////////





