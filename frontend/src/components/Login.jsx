import { useFormDataContext } from "../context/FormDataContext"

export function Login({ showModal, modalRef, setShowLoginModal }) {
  const { formData, handleLoginChange, handleLoginSubmit } = useFormDataContext()

  if(!showModal) return null

  const formSubmit = (e) => {
    e.preventDefault()
    handleLoginSubmit()
    setShowLoginModal(false)
  }

  return (
    <div className="modal">
      <div className="modal-content" ref={modalRef}>
        <h1>Login</h1>
        <form onSubmit={formSubmit} >
          <input type="email" name="email" value={formData.email} onChange={handleLoginChange} required/>
          <input type="password" name="password" value={formData.password} onChange={handleLoginChange} required/>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}