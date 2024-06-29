import { useFormDataContext } from "../context/FormDataContext"

export function CreatePin() {
  const { formData, handleCreatePinChange, handleCreatePinSubmit } = useFormDataContext()

  const formSubmit = (e) => {
    e.preventDefault()
    handleCreatePinSubmit()
  }

  return (  
    <>  
      <h1>Create Pin</h1>
      <form onSubmit={formSubmit}>
        <input type="text" name="title" value={formData.title} onChange={handleCreatePinChange} />
        <input type="text" name="description" value={formData.description} onChange={handleCreatePinChange} />
        <input type="file" accept="image/webp, image/png, image/jpg, image/jpeg, image/avif" name="image" onChange={handleCreatePinChange} required/>
        <button type="submit">Publish</button>
      </form>
    </>
  )
}