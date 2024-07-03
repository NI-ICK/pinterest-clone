import { useContext, createContext, useState, useEffect } from "react"
import axios from 'axios'

const UserContext = createContext()

export function useUserContext() {
  return useContext(UserContext)
}

export function UserContextProvider({ children }) {
  const [currUser, setCurrUser] = useState({})
  const [users, setUsers] = useState([])
  const [userLoading, setUserLoading] = useState(true)

  const fetchCurrUser = async () => {
    try {
      const response = await axios.get('https://localhost:5000/user', { withCredentials: true })
      setCurrUser(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://localhost:5000/users', { withCredentials: true })
      setUsers(response.data)
      setUserLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCurrUser()
    fetchUsers()
  }, [])

  const logoutUser = async () => {
    try {
      await axios.get('https://localhost:5000/logout', { withCredentials: true })
      setCurrUser(null)
    } catch (error) {
      console.log(error)
    }
  }

  return(
    <UserContext.Provider value={{ users, currUser, setCurrUser, logoutUser, userLoading, fetchCurrUser, fetchUsers }}>
      {children}
    </UserContext.Provider>
  )
}