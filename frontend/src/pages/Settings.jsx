import { useFormDataContext } from "../context/FormDataContext"

export function Settings() {
  const { formData, handleEditUserChange, handleEditUserSubmit } = useFormDataContext()

  const formSubmit = (e) => {
    e.preventDefault()
    handleEditUserSubmit()
  }

  return (
    <>
      <form onSubmit={formSubmit}>
        <input type="file" name="avatar" onChange={handleEditUserChange} accept="image/webp, image/png, image/jpg, image/jpeg, image/avif" />
        <input type="text" name="username" value={formData.username} onChange={handleEditUserChange} />
        <input type="password" name="password" value={formData.password} onChange={handleEditUserChange} />
        <input type="email" name="email" value={formData.email} onChange={handleEditUserChange} />
        <button type="submit">Send</button>
      </form>
    </>
  )
}