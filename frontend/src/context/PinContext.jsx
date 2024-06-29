import { useContext, createContext, useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"

const api = axios.create({
  baseURL: 'https://localhost:5000',
  withCredentials: true
})

const PinContext = createContext()

export function usePinContext() {
  return useContext(PinContext)
}

export function PinContextProvider({ children }) {
  const [pins, setPins] = useState([])
  const location = useLocation()
  const [pinLoading, setPinLoading] = useState(true)

  const fetchPins = async () => {
    api.get('/pins')
      .then(response => { 
        setPins(response.data) 
        setPinLoading(false)
      })
      .catch(error => console.log(error))
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
    fetchPins()
  }, [])

  useEffect(() => { 
    adjustGridRows()
  }, [location, pins])

  return(
    <PinContext.Provider value={{ pins, pinLoading, fetchPins }}>
      {children}
    </PinContext.Provider>
  )
}