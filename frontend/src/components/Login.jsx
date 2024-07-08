import { useFormDataContext } from "../context/FormDataContext"
import { HidePasswordIcon, ShowPasswordIcon } from "../assets/PasswordIcons"
import { useState, useRef } from 'react'

export function Login({ showModal, modalRef, setShowLoginModal }) {
  const { formData, handleLoginChange, handleLoginSubmit } = useFormDataContext()
  const [showPassword, setShowPassword] = useState(false)
  const [inputType, setInputType] = useState('password')
  const password = useRef()

  if(!showModal) return null

  const formSubmit = (e) => {
    e.preventDefault()
    handleLoginSubmit()
    setShowLoginModal(false)
  }

  const togglePassword = () => {
    setShowPassword(!showPassword)
    inputType === 'password' ? setInputType('text') : setInputType('password')
  }

  return (
    <div className="modal">
      <div className="modalContent" ref={modalRef}>
        <form onSubmit={formSubmit} className="fInput">
          <div>
            <label htmlFor='email'>E-mail</label>
            <input type="email" name="email" id="email" placeholder='E-mail' value={formData.email} onChange={handleLoginChange} required/>
          </div>
          <div className="passwordContainer">
            <label htmlFor='password'>Password</label>
            <input type={inputType} name="password" id="password" placeholder='Password' ref={password} value={formData.password} onChange={handleLoginChange} required/>
            <div className="passwordIcon" onClick={togglePassword}>
              {showPassword ? <HidePasswordIcon /> : <ShowPasswordIcon /> }
            </div>
          </div>
          <button className='redBtn' type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}