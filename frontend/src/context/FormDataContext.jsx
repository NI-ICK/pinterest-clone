import { useContext, createContext, useState, useEffect } from "react"
import axios from "axios"
import { useUserContext } from "./UserContext"
import { usePinContext } from "./PinContext"

const FormDataContext = createContext()
  
export function useFormDataContext() {
  return useContext(FormDataContext)
}

export function FormDataContextProvider({ children }) {
  const { currUser, setCurrUser, fetchUsers, fetchCurrUser } = useUserContext()
  const [formData, setFormData] = useState({
    createPin: {
      title: '',
      description: '',
      image: null,
      user: ''
    },
    register: {
      username: '',
      password: '',
      email: ''
    },
    login: {
      email: '',
      password: '',
    },
    edit: {
      username: '',
      password: '',
      email: '',
      photo: null,
      firstName: '',
      lastName: '',
      about: '',
      user: {}
    }
  })
  const { fetchPins } = usePinContext()
  
  // Create Pin Form

  const handleCreatePinChange = (e) => {
    const { name, value, files } = e.target
    if(name === 'image') {
      setFormData({ ...formData, createPin: { ...formData.createPin, image: files[0] }})
    } else {
      setFormData({ ...formData, createPin: { ...formData.createPin, [name]: value }})
    }  
  }

  const handleCreatePinSubmit = async () => {
    const updatedFormData = { ...formData, createPin: { ...formData.createPin, user: currUser.username }}
    try {
      console.log(formData.createPin)
      await axios.post('https://localhost:5000/createPin', updatedFormData.createPin, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } catch (error) {
      console.error('Error creating pin:', error);
    }
    fetchPins()
  }

  // Register Form

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setFormData(prevFormData => ({ ...prevFormData, register: { ...prevFormData.register, [name]: value }}))
  }

  const handleRegisterSubmit = async () => {
    try {
      await axios.post('https://localhost:5000/register', formData.register, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Error registering:', error);
    }
  }

  // Login Form

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setFormData(prevFormData => ({ ...prevFormData, login: { ...prevFormData.login, [name]: value }}))
  }

  const handleLoginSubmit = async () => {
    try {
      const response = await axios.post('https://localhost:5000/login', formData.login, { 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      })
      setCurrUser(response.data)
    } catch (error) {
      console.error('Error Loging in:', error);
    }
  }

  // Edit User Form

  const handleEditUserChange = (e) => {
    const { name, value, files } = e.target
    if(name === 'photo') {
      setFormData({ ...formData, edit: { ...formData.edit, photo: files[0] }})
    } else {
      setFormData({ ...formData, edit: { ...formData.edit, [name]: value }})
    }
  }

  const handleEditUserSubmit = async () => {
    const updatedFormData = { ...formData, edit: { ...formData.edit, user: currUser }}
    try {
      await axios.put('https://localhost:5000/editUser', updatedFormData.edit, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } catch (error) {
      console.error('Error editing user:', error);
    }
    fetchUsers()
    fetchCurrUser()
  }

  return (
    <FormDataContext.Provider value={{ 
      formData, 
      handleCreatePinChange, 
      handleCreatePinSubmit, 
      handleRegisterChange, 
      handleRegisterSubmit, 
      handleLoginChange, 
      handleLoginSubmit,
      handleEditUserChange,
      handleEditUserSubmit 
      }} >
      {children}
    </FormDataContext.Provider>
  )
}