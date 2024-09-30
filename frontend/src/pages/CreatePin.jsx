import { useFormDataContext } from "../context/FormDataContext"
import { Dropzone } from "../components/Dropzone"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { XIcon } from '../assets/XIcon'

export function CreatePin() {
  const { formData, handleCreatePinChange, handleCreatePinSubmit } = useFormDataContext()
  const navigate = useNavigate()
  const [tags, setTags] = useState([])
  const [inputValue, setInputValue] = useState('')

  const formSubmit = (e) => {
    e.preventDefault()
    handleCreatePinSubmit()
    navigate('/')
    const form = e.target
    form.reset()
  }

  useEffect(() => {
    handleCreatePinChange({ target: { name: 'tags', value: tags.join(', ')}})
  }, [tags])

  const handleTagInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      setTags([...tags, inputValue.trim()])
      setInputValue('')
      e.preventDefault()
    }
  }

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  return (  
    <>  
      <form onSubmit={formSubmit} className="fInput">
        <div className="formHeader">
          <h2>Create Pin</h2>
          <button type="submit" className="redBtn" tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter') e.target.click() }}>Publish</button>
        </div>
        <div className="formInputs">
          <Dropzone />
          <div className="textInputs">
            <div>
              <label htmlFor="title">Title</label>
              <input type="text" name="title" id="title" placeholder="Add title" value={formData.title} onChange={handleCreatePinChange} />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <textarea type="text" name="description" id="description" placeholder="Add description" value={formData.description} onChange={handleCreatePinChange} />
            </div>
            <div>
              <label htmlFor="tags">Tags</label>
              <textarea type="text" name="tags" id="tags" placeholder="Add tag and press Enter" value={inputValue} onChange={handleTagInputChange} onKeyUp={handleTagKeyPress} />
            </div>
            <div className="tags">
              {tags.map((tag, index) => (
                <span key={index}>{tag}<button type="button" onClick={() => removeTag(index)}><XIcon color='black' rotate='90deg' size='.8'/></button></span>
              ))}
            </div>
          </div>
        </div>
      </form>
    </>
  )
}