import { useFormDataContext } from "../context/FormDataContext"
import { useState, useRef, useEffect } from "react"
import { HidePasswordIcon, ShowPasswordIcon } from "../assets/PasswordIcons"
import { DeleteUser } from "../components/DeleteUser"

export function AccountSettings() {
  const { formData, handleEditUserChange, handleEditUserSubmit } = useFormDataContext()
  const [showPassword, setShowPassword] = useState(false)
  const [inputType, setInputType] = useState('password')
  const [showModal, setShowModal] = useState(false)
  const password = useRef()
  const modal = useRef()

  const togglePassword = () => {
    setShowPassword(!showPassword)
    inputType === 'password' ? setInputType('text') : setInputType('password')
  }

  const formSubmit = (e) => {
    e.preventDefault()
    handleEditUserSubmit()
    const form = e.target
    form.reset()
  }

  useEffect(() => {
    if(showModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showModal])

  const handleClickOutside = (e) => {
    if (modal.current && !modal.current.contains(e.target)) {
      setShowModal(false)
    }
  }

  return (
    <>
    <div className="userSettings">
      <form onSubmit={formSubmit} id="editForm" className="fInput editForm formInputs textInputs">
        <h1>Account Menagement</h1>
        <p>Make changes to your personal information</p>
        <div className="passwordContainer">
            <label htmlFor='password'>Change Password</label>
            <input type={inputType} name="password" id="password" placeholder='Password' ref={password} value={formData.password} onChange={handleEditUserChange} />
            <div className="passwordIcon" onClick={togglePassword}>
              {showPassword ? <HidePasswordIcon /> : <ShowPasswordIcon /> }
            </div>
          </div>
        <div>
          <label htmlFor="email">Change E-mail</label>
          <input type="email" name="email" id="email" placeholder="E-mail" value={formData.email} onChange={handleEditUserChange} />
        </div>
      </form>
      <button className="showModal redBtn" type="button" onClick={() => setShowModal(true)}>Delete User</button>
      <DeleteUser showModal={showModal} modal={modal} setShowModal={setShowModal}/>
    </div>
    </>
  )
}