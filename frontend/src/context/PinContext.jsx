import { useContext, createContext, useState, useEffect } from "react"
import axios from "axios"
import { useUserContext } from "./UserContext"

const PinContext = createContext()

export function usePinContext() {
  return useContext(PinContext)
}

export function PinContextProvider({ children }) {
  const [pins, setPins] = useState([])
  const [pinLoading, setPinLoading] = useState(true)
  const [pin, setPin] = useState({})
  const { currUser } = useUserContext()
  const [createdPins, setCreatedPins] = useState([])

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

  const fetchCreatedPins = async (id) => {
    try {
      const response = await axios.get('https://localhost:5000/api/pins/created', { params: { id }})
      setCreatedPins(response.data)
    } catch(error) {
      console.log('Error fetching created pins', error)
    }
  }

  const adjustGridRows = () => {
    const allPins = document.querySelectorAll('.pin')

    allPins.forEach(pin => {
      const img = pin.querySelector('img')
      const title = pin.querySelector('.pinTitle')
      img.addEventListener('load', () => {
        const pinHeight = img.clientHeight + title.clientHeight + 10
        const rowHeight = 10
        const rowSpan = Math.ceil(pinHeight / rowHeight)
        pin.style.gridRowEnd = `span ${rowSpan}`
      })
      if (img.complete) {
        img.dispatchEvent(new Event('load'));
      }
    })
  }  
  
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
  
  return (
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
      fetchCreatedPins,
      createdPins,
      adjustGridRows
      }}>
      {children}
    </PinContext.Provider>
  )
}