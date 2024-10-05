import { useContext, createContext, useState, useEffect } from "react"
import axios from 'axios'

const UserContext = createContext()

export function useUserContext() {
  return useContext(UserContext)
}

export function UserContextProvider({ children }) {
  const [currUser, setCurrUser] = useState(null)
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)
  const noUserImgUrl = 'https://res.cloudinary.com/dzg5ek6qa/image/upload/v1728063977/noPhoto_hwrr7w.webp'
  const [ isMobile, setIsMobile ] = useState(false)
  
  const fetchCurrUser = async () => {
    try {
      const config = { withCredentials: true }
      const token = localStorage.getItem('token')
      
      if(token) config.headers = { 'Authorization': `Bearer ${token}` }

      const response = await axios.get(`/currUser`, config)
      setCurrUser(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/users`)
      setUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchUser = async (username) => {
    try {
      const response = await axios.get(`/user`, { params: { username }})
      setUser(response.data)
      if(!response.data) return false
      return true
    } catch (error) {
      console.log(error)
    }
  }

  const logoutUser = async () => {
    try {
      localStorage.removeItem('token')
      setCurrUser(null)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteUser = async () => {
    try {
      logoutUser()
      await axios.delete(`/delete/user/${currUser._id}`)
      fetchUsers()
    } catch(error) {
      console.log('Error deleting user:', error)
    } 
  }

  const handleResize = () => {
    if(window.innerWidth < 500) return setIsMobile(true)
    return setIsMobile(false)
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return(
    <UserContext.Provider value={{ 
      users, 
      currUser, 
      setCurrUser, 
      logoutUser, 
      fetchCurrUser, 
      fetchUsers,
      handleDeleteUser,
      fetchUser,
      user,
      noUserImgUrl,
      isMobile
      }}>
      {children}
    </UserContext.Provider>
  )
}