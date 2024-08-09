import { useContext, createContext, useState } from "react"
import axios from 'axios'

const UserContext = createContext()

export function useUserContext() {
  return useContext(UserContext)
}

export function UserContextProvider({ children }) {
  const [currUser, setCurrUser] = useState({ username: null })
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)
  
  const fetchCurrUser = async () => {
    try {
      const response = await axios.get(`/api/currUser`, { withCredentials: true })
      setCurrUser(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/api/users`)
      setUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchUser = async (username) => {
    try {
      const response = await axios.get(`/api/user`, { params: { username }})
      setUser(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const logoutUser = async () => {
    try {
      await axios.get(`/api/logout`)
      setCurrUser(null)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteUser = async () => {
    try {
      logoutUser()
      await axios.delete(`/api/delete/user/${currUser._id}`)
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