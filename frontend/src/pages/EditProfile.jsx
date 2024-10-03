import { useFormDataContext } from "../context/FormDataContext"
import { useRef, useState, useEffect } from "react"
import { useUserContext } from "../context/UserContext"
import { useNavigate, useOutletContext } from "react-router-dom"

export function EditProfile() {
  const { formData, handleEditUserChange, handleEditUserSubmit } = useFormDataContext()
  const { currUser, fetchCurrUser, noUserImgUrl } = useUserContext()
  const context = useOutletContext()
  const [loading, setLoading] = useState(true)
  const [ selectedProfileImg, setSelectedProfileImage ] = useState()
  const [ imageDimensions, setImageDimensions ] = useState({ width: 0, height: 0 })
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if(file) setSelectedProfileImage(URL.createObjectURL(file))
  }

  useEffect(() => {
    if (selectedProfileImg) {
      const img = new Image()
      img.onload = function() {
        setImageDimensions({ width: img.width, height: img.height })
      }
      img.src = selectedProfileImg
    }

    return () => { 
      if(selectedProfileImg) URL.revokeObjectURL(selectedProfileImg)
    }
  }, [selectedProfileImg])

  return (
    <>
    {!loading &&
      <form onSubmit={formSubmit} id="editForm" className="fInput textInputs">
        <h1>Edit profile</h1>
        <div className="photoUpload">
          <input 
            type="file" 
            name="photo" 
            onChange={(e) => { 
                handleEditUserChange(e)
                handleFileChange(e)
            }} 
            ref={fileInput} 
            accept="image/*" 
            style={{ display: 'none' }}/>
          <div>
            <label>Photo</label>
            {selectedProfileImg && <div className='userPhoto' style={{
                backgroundImage: selectedProfileImg && `url(${selectedProfileImg})`,
                width: selectedProfileImg && imageDimensions.width,
                height: selectedProfileImg && imageDimensions.height,
            }}>
            </div>}
            {!selectedProfileImg && <img draggable={false} src={currUser.photo ? currUser.photo : noUserImgUrl} />}
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
        {context.isMobile && <button className='redBtn'>Save</button>}
      </form>
    }
    </>
  )
}