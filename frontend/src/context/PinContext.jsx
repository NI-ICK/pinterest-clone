import { useContext, createContext, useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { useUserContext } from "./UserContext"

const PinContext = createContext()

export function usePinContext() {
  return useContext(PinContext)
}

export function PinContextProvider({ children }) {
  const [pins, setPins] = useState(null)
  const location = useLocation()
  const [pinLoading, setPinLoading] = useState(true)
  const [pin, setPin] = useState(null)
  const { currUser } = useUserContext()

  const fetchPins = async () => {
    try {
      const response = await axios.get('https://localhost:5000/api/pins')
      setPins(response.data)
      setPinLoading(false)
    } catch(error) {
      console.log('Error fetching pins: ', error)
    }
  }

  const fetchPin = async (id) => {
    try {
      const response = await axios.get(`https://localhost:5000/api/pin/${id}`)
      setPin(response.data)
    } catch(error) {
      console.log('Error fetching pins: ', error)
    }
  }

  const fetchPinComments = async (id) => {
    try {
      const response = await axios.get(`https://localhost:5000/api/pin/${id}/comments`)
      return response.data.comments
    } catch(error) {
      console.log('Error fetching comments: ', error)
    }
  }

  const adjustGridRows = () => {
    const allPins = document.querySelectorAll('.pin')

    allPins.forEach(pin => {
      const img = pin.querySelector('img')
      const title = pin.querySelector('.pinTitle')
      img.addEventListener('load', function() {
        const pinHeight = img.clientHeight + title.clientHeight + 10
        const rowHeight = 10
        const rowSpan = Math.ceil(pinHeight / rowHeight)
        pin.style.gridRowEnd = `span ${rowSpan}`
      })
    })
  }  

  useEffect(() => {
    if(location.pathname === '/') fetchPins()
  }, [location])

  useEffect(() => { 
    if(location.pathname === '/') adjustGridRows()
  }, [pins, location])

  const handleDeletePin = async (id) => {
    try {
      await axios.delete(`https://localhost:5000/api/delete/pin/${id}`)
      fetchPins()
    } catch(error) {
      console.log('Error deleting pin:', error)
    } 
  }

  const handleLikes = async (id, action) => {
    try {
      await axios.put('https://localhost:5000/api/likes', { id, action, currUser })
    } catch(error) {
      console.log("Error: ", error)
    }
  }

  return(
    <PinContext.Provider value={{ 
      fetchPins, 
      pins, 
      fetchPin, 
      pin, 
      setPin, 
      pinLoading, 
      setPinLoading, 
      handleDeletePin, 
      handleLikes,
      fetchPinComments,
      }}>
      {children}
    </PinContext.Provider>
  )
}