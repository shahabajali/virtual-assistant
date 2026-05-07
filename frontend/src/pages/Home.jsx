import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

import { userDataContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import user from "../assets/user.gif"
import ai from "../assets/ai.gif"

import { HiMenuAlt2 } from "react-icons/hi"
import { RxCross1 } from "react-icons/rx"

export default function Home() {
  const {
    userData,
    serverurl,
    setUserData,
    getGeminiRespose,
  } = useContext(userDataContext)

  const navigate = useNavigate()

  // ================= STATES =================
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const [ham, setHam] = useState(false)

  // ================= REFS =================
  const recognitionRef = useRef(null)
  const isRecognizingRef = useRef(false)
  const isSpeakingRef = useRef(false)
  const stopAllRef = useRef(false)
  const greetedRef = useRef(false)
  const restartTimeoutRef = useRef(null)

  const synth = window.speechSynthesis

  // ================= LOGOUT =================
  const handleLogOut = async () => {
    try {
      stopAllRef.current = true
      clearTimeout(restartTimeoutRef.current)

      recognitionRef.current?.stop()
      synth.cancel()

      setListening(false)
      setUserText("")
      setAiText("")

      await axios.get(`${serverurl}/api/auth/logout`, {
        withCredentials: true,
      })

      localStorage.clear()
      sessionStorage.clear()

      setUserData(null)

      navigate("/signin", { replace: true })
    } catch (error) {
      console.log(error)
      setUserData(null)
      navigate("/signin", { replace: true })
    }
  }

  // ================= START RECOGNITION =================
  const startRecognition = () => {
    if (
      stopAllRef.current ||
      isRecognizingRef.current ||
      isSpeakingRef.current ||
      !recognitionRef.current
    ) return

    try {
      recognitionRef.current.start()
    } catch (e) {
      if (e.name !== "InvalidStateError") {
        console.log(e)
      }
    }
  }

  // ================= SPEAK =================
  const speak = (text) => {
    if (!text) return

    synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    utterance.lang = "en-US"

    utterance.onstart = () => {
      isSpeakingRef.current = true
    }

    utterance.onend = () => {
      isSpeakingRef.current = false
      setAiText("")

      restartTimeoutRef.current = setTimeout(() => {
        startRecognition()
      }, 1000)
    }

    utterance.onerror = () => {
      isSpeakingRef.current = false
      restartTimeoutRef.current = setTimeout(() => {
        startRecognition()
      }, 1000)
    }

    synth.speak(utterance)
  }

  // ================= COMMAND HANDLER =================
  const handleCommand = (data) => {
    if (!data) return

    const { type, userInput, response } = data

    setUserText("")
    setAiText(response)

    speak(response)

    if (type === "google_search") {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
        "_blank"
      )
    }

    if (type === "youtube_search" || type === "youtube_play") {
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`,
        "_blank"
      )
    }

    if (type === "instagram_open") {
      window.open("https://instagram.com", "_blank")
    }

    if (type === "facebook_open") {
      window.open("https://facebook.com", "_blank")
    }

    if (type === "calculator_open") {
      window.open("https://www.google.com/search?q=calculator", "_blank")
    }

    if (type === "weather_show") {
      window.open("https://www.google.com/search?q=weather", "_blank")
    }
  }

  // ================= EFFECT =================
  useEffect(() => {
    if (!userData) return

    stopAllRef.current = false

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.log("Speech not supported")
      return
    }

    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognitionRef.current = recognition

    // START
    recognition.onstart = () => {
      isRecognizingRef.current = true
      setListening(true)
    }

    // END
    recognition.onend = () => {
      isRecognizingRef.current = false
      setListening(false)

      if (stopAllRef.current || isSpeakingRef.current) return

      restartTimeoutRef.current = setTimeout(() => {
        startRecognition()
      }, 1200)
    }

    // ERROR
    recognition.onerror = (e) => {
      isRecognizingRef.current = false
      setListening(false)

      if (e.error === "no-speech" || e.error === "aborted") return

      restartTimeoutRef.current = setTimeout(() => {
        startRecognition()
      }, 1500)
    }

    // ================= RESULT (FIXED) =================
    recognition.onresult = async (event) => {
      try {
        let transcript = ""

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          transcript += event.results[i][0].transcript
        }

        transcript = transcript.trim()

        // ✅ USER INPUT ALWAYS SHOW IN CONSOLE
        console.log(" USER REQUEST:", transcript)

        if (!transcript) return

        setUserText(transcript)

        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)

        const data = await getGeminiRespose(transcript)

        console.log("🤖 AI RESPONSE:", data)

        setTimeout(() => {
          handleCommand(data)
        }, 500)

      } catch (error) {
        console.log(error)

        setAiText("Sorry something went wrong")
        speak("Sorry something went wrong")
      }
    }

    // GREETING
    if (!greetedRef.current && userData?.name) {
      greetedRef.current = true

      setTimeout(() => {
        const msg = `Hello ${userData.name}, how can I help you`

        setAiText(msg)
        speak(msg)
      }, 1000)
    }

    // START
    setTimeout(() => {
      startRecognition()
    }, 2000)

    return () => {
      stopAllRef.current = true
      clearTimeout(restartTimeoutRef.current)

      recognition.stop()
      synth.cancel()

      isRecognizingRef.current = false
      isSpeakingRef.current = false
      setListening(false)
    }
  }, [userData])

  // ================= UI =================
 return (
  <div className="w-full h-screen bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col gap-5 relative px-5">

    {/* Menu Icon */}
    <HiMenuAlt2
      className="absolute top-5 right-5 text-white text-3xl cursor-pointer"
      onClick={() => setHam(true)}
    />

    {/* Sidebar */}
    <div
      className={`fixed top-0 right-0 h-full w-[280px] bg-black/90 backdrop-blur-md text-white p-5 shadow-xl transform transition-transform duration-300 ${
        ham ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Close Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Menu</h2>
        <RxCross1
          className="cursor-pointer text-xl"
          onClick={() => setHam(false)}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4">

        <button
          onClick={() => {
            navigate("/customize");
            setHam(false);
          }}
          className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Customize Assistant
        </button>

        <button
          onClick={handleLogOut}
          className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>
    </div>

    {/* Assistant Image */}
    <img
      src={userData?.assistantImage}
      className="w-[250px] h-[300px] object-cover rounded-xl"
    />

    {/* Name */}
    <h1 className="text-white text-xl font-semibold">
      I am {userData?.assistantName}
    </h1>

    {/* GIF Section */}
    {userText ? (
      <img src={user} className="w-[180px]" />
    ) : aiText ? (
      <img src={ai} className="w-[180px]" />
    ) : (
      <img src={user} className="w-[180px]" />
    )}

    {/* Text */}
    <h1 className="text-white text-center text-sm">
      {userText || aiText || "Listening..."}
    </h1>
  </div>
)}