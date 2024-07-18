import { useContext, createContext, useState, useEffect } from "react"
import { useUserContext } from "./UserContext"
import { usePinContext } from "./PinContext"
import axios from "axios"
import { useLocation } from 'react-router-dom'

const FormDataContext = createContext()
  
export function useFormDataContext() {
  return useContext(FormDataContext)
}

export function FormDataContextProvider({ children }) {
  const { currUser, setCurrUser, fetchUsers, fetchCurrUser } = useUserContext()
  const initialFormData = {
    createPin: {
      title:  null,
      description:  null,
      image: null,
      user:  null
    },
    register: {
      username:  null,
      password:  null,
      email:  null
    },
    login: {
      email:  null,
      password:  null,
    },
    edit: {
      username:  null,
      password:  null,
      email:  null,
      photo: null,
      firstName:  null,
      lastName:  null,
      about:  null,
      user:  null
    },
    comment: {
      content:  null,
      user:  null,
      parentId:  null,
    },
  }
  const [formData, setFormData] = useState(initialFormData)
  const { fetchPins } = usePinContext()
  const [formFilled, setFormFilled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const editFormFilled = Object.values(formData.edit).some(value => !!value)
    const commentFormFilled = !!formData.comment.content

    setFormFilled(editFormFilled || commentFormFilled)
  }, [formData.comment, formData.edit])

  useEffect(() => {
    resetFormData()
    setFormFilled(false)
  }, [location])
  
  const resetFormData = () => {
    setFormData(initialFormData)
  }

  // Create Pin Form

  const handleCreatePinChange = (e) => {
    const { name, value, files } = e.target
    if(name === 'image') {
      setFormData(prevFormData => ({ ...prevFormData, createPin: { ...prevFormData.createPin, image: files[0] }}))
    } else {
      setFormData(prevFormData => ({ ...prevFormData, createPin: { ...prevFormData.createPin, [name]: value }}))
    }  
  }

  const handleCreatePinSubmit = async () => {
    const updatedFormData = { ...formData.createPin, user: currUser }
    try {
      console.log(formData.createPin)
      await axios.post('https://localhost:5000/api/createPin', updatedFormData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } catch (error) {
      console.error('Error creating pin:', error);
    }
    fetchPins()
    resetFormData()
  }

  // Register Form

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setFormData(prevFormData => ({ ...prevFormData, register: { ...prevFormData.register, [name]: value }}))
  }

  const handleRegisterSubmit = async () => {
    try {
      await axios.post('https://localhost:5000/api/register', formData.register, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Error registering:', error);
    }
    resetFormData()
  }

  // Login Form

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setFormData(prevFormData => ({ ...prevFormData, login: { ...prevFormData.login, [name]: value }}))
  }

  const handleLoginSubmit = async () => {
    try {
      const response = await axios.post('https://localhost:5000/api/login', formData.login, { 
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      })
      setCurrUser(response.data)
    } catch (error) {
      console.error('Error Loging in:', error);
    }
    resetFormData()
  }

  // Edit User Form

  const handleEditUserChange = (e) => {
    const { name, value, files } = e.target
    if(name === 'photo') {
      setFormData(prevFormData => ({ ...prevFormData, edit: { ...prevFormData.edit, photo: files[0] }}))
    } else {
      setFormData(prevFormData => ({ ...prevFormData, edit: { ...prevFormData.edit, [name]: value }}))
    }
  }

  const handleEditUserSubmit = async () => {
    const updatedFormData = { ...formData.edit, user: currUser._id }
    try {
      await axios.put('https://localhost:5000/api/editUser', updatedFormData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } catch (error) {
      console.error('Error editing user:', error);
    }
    fetchUsers()
    fetchCurrUser()
    resetFormData()
  }

  // Comment Form

  const handleCommentChange = (e, id) => {
    const { name, value } = e.target
    setFormData(prevFormData => ({ ...prevFormData, comment: { ...prevFormData.comment, [name]: value }}))
    setFormData(prevFormData => ({ ...prevFormData, comment: { ...prevFormData.comment, parentId: id }}))
  }

  const handleCommentSubmit = async () => {
    const updatedFormData = { ...formData.comment, user: currUser }
    try {
      await axios.post('https://localhost:5000/api/comment', updatedFormData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error('Error adding comment:', error);
    }
    resetFormData()
  }

  return (
    <FormDataContext.Provider value={{ 
      formData, 
      setFormData,
      handleCreatePinChange, 
      handleCreatePinSubmit, 
      handleRegisterChange, 
      handleRegisterSubmit, 
      handleLoginChange, 
      handleLoginSubmit,
      handleEditUserChange,
      handleEditUserSubmit,
      handleCommentChange,
      handleCommentSubmit,
      formFilled,
      }} >
      {children}
    </FormDataContext.Provider>
  )
}