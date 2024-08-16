import { useContext, createContext, useState, useEffect } from "react"
import axios from "axios"
import { useUserContext } from "./UserContext"
import { useNavigate } from "react-router-dom"

const PinContext = createContext()

export function usePinContext() {
  return useContext(PinContext)
}

export function PinContextProvider({ children }) {
  const [pins, setPins] = useState([])
  const [pin, setPin] = useState(null)
  const { currUser } = useUserContext()
  const [createdPins, setCreatedPins] = useState([])
  const [searchedPins, setSearchedPins] = useState([])
  const [comments, setComments] = useState([])
  const navigate = useNavigate()

  const fetchPins = async () => {
    try {
      const response = await axios.get(`/pins`)
      setPins(response.data)
    } catch(error) {
      console.log('Error fetching pins: ', error)
    }
  }

  const fetchPin = async (id) => {
    try {
      const response = await axios.get(`/pin/${id}`)
      setPin(response.data)
      if(!response.data) return false
      return true
    } catch(error) {
      console.log('Error fetching pins: ', error)
    }
  }

  const fetchPinComments = async (id) => {
    try {
      const response = await axios.get(`/pin/${id}/comments`)
      setComments(response.data.comments)
    } catch(error) {
      console.log('Error fetching comments: ', error)
    }
  }

  const fetchCreatedPins = async (id) => {
    try {
      const response = await axios.get(`/pins/created`, { params: { id }})
      setCreatedPins(response.data)
    } catch(error) {
      console.log('Error fetching created pins', error)
    }
  }

  const fetchSearchedPins = async (query) => {
    try {
      const response = await axios.get(`/pins/search/`, { params: { query }})
      setSearchedPins(response.data)
    } catch(error) {
      console.log('Error fetching searched pins', error)
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
      await axios.delete(`/delete/pin/${id}`)
      fetchPins()
    } catch(error) {
      console.log('Error deleting pin:', error)
    } 
  }
  
  const handleLikes = async (id, action) => {
    try {
      await axios.put(`/likes`, { id, action, currUser })
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
      handleDeletePin, 
      handleLikes,
      fetchPinComments,
      fetchCreatedPins,
      createdPins,
      adjustGridRows,
      searchedPins,
      fetchSearchedPins,
      setSearchedPins,
      comments
      }}>
      {children}
    </PinContext.Provider>
  )
}