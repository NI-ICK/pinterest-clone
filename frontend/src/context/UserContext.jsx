import { useContext, createContext, useState, useEffect } from "react"
import axios from 'axios'

const UserContext = createContext()

export function useUserContext() {
  return useContext(UserContext)
}

export function UserContextProvider({ children }) {
  const [currUser, setCurrUser] = useState({ username: null })
  const [users, setUsers] = useState([])
  const [userLoading, setUserLoading] = useState(true)
  const [user, setUser] = useState(null)
  
  const fetchCurrUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.SITE_URL}/api/currUser`, { withCredentials: true })
      setCurrUser(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.SITE_URL}/api/users`, { withCredentials: true })
      setUsers(response.data)
      setUserLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchUser = async (username) => {
    try {
      const response = await axios.get(`${import.meta.env.SITE_URL}/api/user`, { params: { username }})
      setUser(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const logoutUser = async () => {
    try {
      await axios.get(`${import.meta.env.SITE_URL}/api/logout`, { withCredentials: true })
      setCurrUser(null)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteUser = async () => {
    try {
      logoutUser()
      await axios.delete(`${import.meta.env.SITE_URL}/api/delete/user/${currUser._id}`)
      fetchUsers()
    } catch(error) {
      console.log('Error deleting user:', error)
    } 
  }

  return(
    <UserContext.Provider value={{ 
      users, 
      currUser, 
      setCurrUser, 
      logoutUser, 
      userLoading, 
      setUserLoading, 
      fetchCurrUser, 
      fetchUsers,
      handleDeleteUser,
      fetchUser,
      user
      }}>
      {children}
    </UserContext.Provider>
  )
}