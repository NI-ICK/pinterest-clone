import { useFormDataContext } from "../context/FormDataContext"
import { useState, useEffect } from 'react'
import { XIcon } from "../assets/XIcon"

export function EditPinModal({ showEditPinModal, setShowEditPinModal, id }) {
    const [tags, setTags] = useState([])
    const [inputValue, setInputValue] = useState('')
    const { formData, handleEditPinChange, handleEditPinSubmit } = useFormDataContext()
    const [ isMobile, setIsMobile ] = useState(false)

    const formSubmit = async (e) => {
        e.preventDefault()
        await handleEditPinSubmit(id)
        setShowEditPinModal(false)
        const form = e.target
        form.reset()
    }

    useEffect(() => {
        if(window.innerWidth < 500) setIsMobile(true)
    }, [])
    
    useEffect(() => {
        handleEditPinChange({ target: { name: 'tags', value: tags.join(', ')}})
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
    
    if(!showEditPinModal) return null
    
    return <>
    <div className="modal">
        <div className="modalContent editPin">
            <h1>Edit pin details</h1>
            <form className='fInput' onSubmit={formSubmit}>
                <div className="textInputs">
                    <div>
                        <label htmlFor="title">Title</label>
                        <input type="text" name="title" id='title' onChange={handleEditPinChange} value={formData.title}/>
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea rows={ isMobile ? 3 : 5 } type="text" name="description" id='description' onChange={handleEditPinChange} value={formData.description}/>
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
                <div className="modalBtn">
                    <button type='button' onClick={() => { 
                        setShowEditPinModal(false) 
                        setTags([])
                        }} className="greyBtn">Cancel</button>
                    <button type="submit" className="redBtn">Update</button>
                </div>
            </form>
        </div>
    </div>  
    </>
}