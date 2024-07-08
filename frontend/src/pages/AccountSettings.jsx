import { useFormDataContext } from "../context/FormDataContext"
import { useState, useRef } from "react"
import { HidePasswordIcon, ShowPasswordIcon } from "../assets/PasswordIcons"

export function AccountSettings() {
  const { formData, handleEditUserChange, handleEditUserSubmit } = useFormDataContext()
  const [showPassword, setShowPassword] = useState(false)
  const [inputType, setInputType] = useState('password')
  const password = useRef()

  const togglePassword = () => {
    setShowPassword(!showPassword)
    inputType === 'password' ? setInputType('text') : setInputType('password')
  }

  const formSubmit = (e) => {
    e.preventDefault()
    handleEditUserSubmit()
  }

  return (
    <>
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
    </>
  )
}