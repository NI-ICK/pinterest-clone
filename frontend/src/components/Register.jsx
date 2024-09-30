import { HidePasswordIcon, ShowPasswordIcon } from "../assets/PasswordIcons"
import { useFormDataContext } from "../context/FormDataContext"
import { useState, useRef } from 'react'

export function Register({ showModal, modalRef, setShowRegisterModal }) {
  const { formData, handleRegisterChange, handleRegisterSubmit } = useFormDataContext()
  const [showPassword, setShowPassword] = useState(false)
  const [inputType, setInputType] = useState('password')
  const password = useRef()

  if(!showModal) return null

  const formSubmit = (e) => {
    e.preventDefault()
    handleRegisterSubmit()
    setShowRegisterModal(false)
    const form = e.target
    form.reset()
  }

  const togglePassword = () => {
    setShowPassword(!showPassword)
    inputType === 'password' ? setInputType('text') : setInputType('password')
  }

  return (
    <>
    <div className="modal">
      <div className="modalContent" ref={modalRef}>
        <h1>Register</h1>
        <form onSubmit={formSubmit} className="fInput">
          <div>
            <label htmlFor='username'>Username</label>
            <input type="text" name="username" id="username" placeholder='Username' value={formData.username} onChange={handleRegisterChange} required/>
          </div>
          <div>
            <label htmlFor='email'>E-mail</label>
            <input type="email" name="email" id="email" placeholder='E-mail' value={formData.email} onChange={handleRegisterChange} required/>
          </div>
          <div className="passwordContainer">
            <label htmlFor='password'>Password</label>
            <input type={inputType} name="password" id="password" placeholder='Password' ref={password} value={formData.password} onChange={handleRegisterChange} required/>
            <div className="passwordIcon" onClick={togglePassword}>
              {showPassword ? <HidePasswordIcon /> : <ShowPasswordIcon /> }
            </div>
          </div>
          <button className='redBtn' type="submit">Register</button>
        </form>
      </div>
    </div>
    </>
  )
}