import { useContext, createContext, useState, useEffect } from "react"
import axios from 'axios'

const UserContext = createContext()

export function useUserContext() {
  return useContext(UserContext)
}

export function UserContextProvider({ children }) {
  const [currUser, setCurrUser] = useState({
    username: null,
  })
  const [users, setUsers] = useState(null)
  const [userLoading, setUserLoading] = useState(true)
  
  const fetchCurrUser = async () => {
    try {
      const response = await axios.get('https://localhost:5000/api/user', { withCredentials: true })
      setCurrUser(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://localhost:5000/api/users', { withCredentials: true })
      setUsers(response.data)
      setUserLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    document.querySelector('.loadingScreen').classList.toggle('loading', userLoading)
  }, [userLoading])

  useEffect(() => {
    fetchCurrUser()
    fetchUsers()
  }, [])

  const logoutUser = async () => {
    try {
      await axios.get('https://localhost:5000/api/logout', { withCredentials: true })
      setCurrUser(null)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteUser = async () => {
    try {
      logoutUser()
      await axios.delete(`https://localhost:5000/api/delete/user/${currUser._id}`)
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
      handleDeleteUser
      }}>
      {children}
    </UserContext.Provider>
  )
}