import { useFormDataContext } from "../context/FormDataContext"

export function Register({ showModal, modalRef, setShowRegisterModal }) {
  const { formData, handleRegisterChange, handleRegisterSubmit } = useFormDataContext()

  if(!showModal) return null

  const formSubmit = (e) => {
    e.preventDefault()
    handleRegisterSubmit()
    setShowRegisterModal(false)
  }

  return (
    <div className="modal">
      <div className="modal-content" ref={modalRef}>
        <h1>Register</h1>
        <form onSubmit={formSubmit}>
          <input type="text" name="username" value={formData.username} onChange={handleRegisterChange} required/>
          <input type="password" name="password" value={formData.password} onChange={handleRegisterChange} required/>
          <input type="email" name="email" value={formData.email} onChange={handleRegisterChange} required/>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  )
}