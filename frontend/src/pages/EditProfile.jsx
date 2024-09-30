import { useFormDataContext } from "../context/FormDataContext"
import { useRef, useState, useEffect } from "react"
import { useUserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"

export function EditProfile() {
  const { formData, handleEditUserChange, handleEditUserSubmit } = useFormDataContext()
  const { currUser, fetchCurrUser, noUserImgUrl } = useUserContext()
  const [loading, setLoading] = useState(true)
  const fileInput = useRef()
  const navigate = useNavigate()

  const fetchData = async () => {
    await fetchCurrUser()
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleInputClick = () => {
    fileInput.current.click()
  }

  const formSubmit = (e) => {
    navigate('/')
    e.preventDefault()
    handleEditUserSubmit()
    const form = e.target
    form.reset()
  }

  return (
    <>
    {!loading &&
      <form onSubmit={formSubmit} id="editForm" className="fInput textInputs">
        <h1>Edit profile</h1>
        <div className="photoUpload">
          <input 
            type="file" 
            name="photo" 
            onChange={handleEditUserChange} 
            ref={fileInput} 
            accept="image/*" 
            style={{ display: 'none' }}/>
          <div>
            <label>Photo</label>
            <img src={currUser.photo ? currUser.photo : noUserImgUrl} />
          </div>
          <button onClick={handleInputClick} type="button" className="greyBtn">Change</button>
        </div>
        <div className="name">
          <div>
            <label htmlFor="firstName">First Name</label>
            <input type="text" name="firstName" id="firstName" placeholder="First Name" value={formData.firstName} onChange={handleEditUserChange}/>
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input type="text" name="lastName" id="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleEditUserChange}/>
          </div>
        </div>
        <div>
          <label htmlFor="about">About</label>
          <input type="text" name="about" id="about" placeholder="Say something about yourself" value={formData.about} onChange={handleEditUserChange}/>
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" placeholder="Username" value={formData.username} onChange={handleEditUserChange} />
        </div>
      </form>
    }
    </>
  )
}