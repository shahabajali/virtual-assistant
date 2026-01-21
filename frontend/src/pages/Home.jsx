import React, { useContext, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import { useEffect } from 'react'
import user from '../assets/user.gif'
import ai from '../assets/ai.gif'
import { HiMenuAlt2 } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";

export default function Home() {
  const{userData ,serverurl,setUserData,  getGeminiRespose} = useContext(userDataContext)
  const  navigate =  useNavigate()
  // useState for listening
  const[listening,setListening] =  useState(false);
  const[userText,setUserText] =useState("");
  const[aiText,setAiText] = useState("");
  const [ham ,setHam]  = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef =  useRef(null)
  const isRecognizingRef = useRef(false)
  const synth =  window.speechSynthesis

  //  logout api
  const handleLogOut = async()=>{
    try {
      const result =  await axios.get(`${serverurl}/api/auth/logout`,
        { withCredentials:true})
        setUserData(null);
        navigate('/sining')
   } catch (error) {
     setUserData(null);
      console.log(error);
    }
  }
  const startRecoginition =()=>{
    if(!isRecognizingRef.current && !isSpeakingRef.current){
       try {
       recognitionRef.current?.start()
       console.log(" Recognition request to start")
    } catch (error) {
      if(!error.name !== "InvaloidStateError"){
        console.error("Start error:",error)
      }
    }
    }
   
  }
  const speak = (text)=>{
    const utterence =  new SpeechSynthesisUtterance(text)
    utterence.lang ='hi-IN';

    const voices =  synth.getVoices()
    const hindiVoice = voices.find(   v => v.lang === 'hi-IN' ) 
    if(hindiVoice){
      utterence.voice =  hindiVoice;
    }
    isSpeakingRef.current =  true;
     utterence.onend=()=>{
       setAiText("");

      isSpeakingRef.current = false;
     setTimeout(()=>{
           startRecoginition();  // delay to race condition
     },800)
   
     }
     synth.cancel(); // phle speech ko band karta hai
    synth.speak(utterence)
  }
  const handleCommand=(data)=>{
    const {type,userInput,response} =data
    speak(response);
    if( type === 'google_search'){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`,'_blank');
    }

    if( type === 'calculator_open'){

      window.open(`https://www.google.com/search?q=calculator`,'_blank');
   
    }
    
     if( type === 'instagram_open'){

      window.open(`https://www.instagram.com/`,'_blank');
    }

     if( type === 'facebook_open'){

      window.open(`https://www.facebook.com/`,'_blank');
    }
      
     if( type === 'weather_show'){

      window.open(`https://www.google.com/search?q=weather`,'_blank');
    }
      if( type === 'weather_show'){

      window.open(`https://www.google.com/search?q=weather`,'_blank');
    }


     if( type === 'youtube_search' || type === 'youtube_play'){
       const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`,'_blank');
    }
  }

  useEffect(()=>{
  const SpeechRecognition =window.SpeechRecognition ||  window.webkitSpeechRecognition
  const recognition =  new SpeechRecognition()
   recognition.continuous = true,
   recognition.lang =  'en-US'
   recognition.interimResults =  false;

    recognitionRef.current =  recognition
    //  create mount variable

    let isMounted =  true; //  flag to avoid setState unmountend component

    //  start recognition only one second delay if components stils mounted

    // creat a function
    const startTimeout =  setTimeout(()=>{
      if(isMounted && !isSpeakingRef.current && 
        !isRecognizingRef.current){
          try {
            recognition.start();
            console.log("Recognition request to start")
          } catch (e) {
            if(e.name !== "InvalidState"){
              console.log(e);
            }
          }
        }
    },1000)
     
    //  const safeRecognition =()=>{
    //   if(!isSpeakingRef.current && !isRecognizingRef.current){
    //      try {
    //        recognition.start()
    //        console.log("Recognition requested to start");
    //      } catch (err) {
    //       if(err.name !== "InvalidStateError"){
    //         console.error("Start error :",err);
    //       }
    //      }

    //   }
    //  }
     //
     recognition.onstart =()=>{
      console.log("Recognition started");
      isRecognizingRef.current = true;
      setListening(true);

     }

     recognition.onend = ()=>{
       isRecognizingRef.current = false;
      setListening(false);
      if(isMounted && !isSpeakingRef.current){
        setTimeout(()=>{
          if(isMounted){
            try {
              recognition.start();
              console.log("Recognition restarted")
            } catch (e) {
              if(e.name !== "InvalidStateError") console.error(e)
            }
          }
        },1000);
      }
      
     };
     recognition.onerror =(event)=>{
      console.warn("Recognition error",event.error);
      isRecognizingRef.current =  false;
      setListening(false);
      if(event.error !== "aborted" &&  isMounted && !isSpeakingRef.current){
        setTimeout(()=>{
          if(isMounted){
            try {
              recognition.start();
              console.log("Recognition restart after error");
            } catch (e) {
              if(e.name !== "InvalidStateError") console.error(e);
            }
          }
        },1000);
      }
     };

    recognition.onresult= async (e)=>{
     const transcript =  e.results[e.results.length-1][0].transcript.trim();
     console.log(" heard : " +  transcript);
     if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){
      setAiText("")
      setUserText(transcript)
      recognition.stop();
      isRecognizingRef.current =  false;
      setListening(false);
       const data =  await  getGeminiRespose(transcript)
       setAiText(data.response);
       setUserText("")
       console.log(data)
        // setAiText("")
     handleCommand(data);

     }
    }
 
  //

  // greating 

  const greating = new SpeechSynthesisUtterance(` Hello ${userData.name}  what  can I help you with?`)
  greating.lang = 'hi-IN'
  window.speechSynthesis.speak(greating)

  return ()=>{
    isMounted =  false;
    clearTimeout(startTimeout);
    recognition.stop()
    setListening(false)
    isRecognizingRef.current =false;
   
  }

  },[])


  ////////////////////////////////
   

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black]
     to-[#030353] flex justify-center items-center flex-col gap-[15px]  relative px-[20px]  overflow-hidden'>
      {/* /////forlogout */}
    {/* menu */}
    <HiMenuAlt2   className='lg:hidden absolute top-[20px] right-[20px]  w-[25px] h-[25px]  text-white'
    onClick={()=> setHam(true)} />

    
    
     {/* // //////////////////// new div*/}
     <div className={`z-10 absolute top-0 w-full h-full lg:hidden bg-[#00000056]  backdrop-blur-lg p-[20px]
     flex flex-col   items-start  gap-[20px] ${ham?'translate-x-0 ': 'translate-x-full'} transition-transform`}>
      <RxCross1   className=' absolute top-[20px] right-[20px]  w-[25px] h-[25px]  text-white'onClick={()=> setHam(false)}/>

      {/* ///////////////////////// */}
       <button className='min-w-[150px]   h-[60px] text-black font-semibold bg-white 
       rounded-full text-[20px]    min-mt-[8px]  px-[8px] py-[15px] sm:mt-[8px];    text-center    cursor-pointer'
       onClick={handleLogOut} >Logout</button>
        {/* //for customize your assistance */}
         <button className='min-w-[150px] h-[60px] text-black font-semibold 
         bg-white rounded-full text-[20px]   px-[8px] py-[15px]   text-center cursor-pointer' 
         onClick={()=>navigate('/customize')}> 
          Customize Your Assistance
        </button>
        <div className=' w-full h-[2px] bg-gray-400 '></div>
       <h1  className=' text-white font-bold text-[19px]'> Histry</h1>

       <div className="w-full h-[400px] overflow-y-auto flex flex-col gap-5">
  {userData.history?.map((his, index) => (
    <span key={index} className="w-full text-white text-[18px]">
      {his}
    </span>
  ))}
</div>

      
     </div>
     {/* for large screen */}
       <HiMenuAlt2   className=' absolute hidden lg:block top-[40px] left-[30px]  w-[30px] h-[25px]  text-white'
    onClick={()=> setHam(true)} />
         <div className={`z-10 absolute top-0 w-full h-screen   hidden lg:block bg-[#00000056]  backdrop-blur-lg p-[40px]
     flex flex-col   items-start ${ham?"translate-x-0 ":"translate-x-full"}  transition-transform`}>
   <RxCross1   className=' absolute hidden lg:block top-[40px] left-[30px]  w-[30px] h-[25px]  text-white'    onClick={()=> setHam(false)} />
    <h1 className=' text-white font-semibold text-[25px] mt-[70px]'> Histry</h1>
    <div className=' w-full h-[2px] bg-gray-400 '></div>
    <div className=' w-full h-[400px]  flex flex-col gap[20px] overflow-y-auto '>
      {userData.history?.map((his)=>
      (<span className=' text-gray-200 font-semibold text-[20px] '>{his}</span>)
      )}

    </div>

     </div>
     
       <button className='min-w-[150px]   h-[60px] text-black font-semibold bg-white 
       rounded-full text-[20px]  mt-2  min-mt-[8px]  px-[8px] py-[15px] sm:mt-[8px];    absolute hidden lg:block top-[40px] right-[50px]  text-center    cursor-pointer'
       onClick={handleLogOut} >Logout</button>
        {/* //for customize your assistance */}
         <button className='min-w-[150px] h-[60px] text-black font-semibold 
         bg-white rounded-full text-[20px]   px-[8px] py-[15px] mt-2  absolute hidden lg:block top-[120px] right-[50px] text-center cursor-pointer' 
         onClick={()=>navigate('/customize')}> 
          Customize Your Assistance
        </button>
      
      <div className='w-[260px] h-[400px]  flex justify-center
      items-center overflow-hidden rounded-[20px] 
  relative'> 
      <img src={userData?.assistantImage} alt=""
      className='w-full h-full object-cover absolute" '/>
</div>
<h1  className='text-white text-[18px] font-semibold'> I am {userData.
assistantName
}</h1>
{!aiText && <img src={user} alt ="" className='w-[200px]'/> }
{aiText && <img src={ai} alt ="" className='w-[200px]'/> }

<h1 className='text-white text-[18px] font-bold   text-wrap' >{userText?userText:aiText?aiText:null}</h1>

       
    </div>
  )
}
