import { useUserContext } from "../context/UserContext"

export function Settings() {
  const { formdata, handleEditUserChange, handleEditUserSubmit } = useUserContext()

  const formSubmit = (e) => {
    e.preventDefault()
    handleEditUserSubmit()
  }

  return (
    <>
      <form onClick={formSubmit}>
        <input type="file" name="image" onChange={handleEditUserChange} accept="image/webp, image/png, image/jpg, image/jpeg, image/avif" />
        <input type="text" name="username" value={formdata.username} onChange={handleEditUserChange} />
        <input type="password" name="password" value={formdata.password} onChange={handleEditUserChange} />
        <input type="email" name="email" value={formdata.email} onChange={handleEditUserChange} />
        <input type="submit" />
      </form>
    </>
  )
}