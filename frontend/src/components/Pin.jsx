import { CollectionsModal } from "./CollectionsModal"
import { ArrowDownIcon } from '../assets/ArrowDownIcon'
import { useCollectionContext } from "../context/CollectionContext"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useUserContext } from "../context/UserContext"

export function Pin({ pin, index, onLoad }) {
  const { setSelectedPinId, setShowColModal, handleCollectionAdd, fetchUserCollections, handleCollectionRemove, selectedCollection } = useCollectionContext()
  const { currUser } = useUserContext()
  const [btnClass, setBtnClass] = useState('redBtn')
  const [btnText, setBtnText] = useState("Save")
  const navigate = useNavigate()
  const [hoverIndex, setHoverIndex] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleBtnClick = async () => {
    setLoading(true)
    if(selectedCollection.pins.some(p => p._id === pin._id)) {
      setBtnClass('redBtn')
      setBtnText('Save')
      await handleCollectionRemove(selectedCollection._id, pin._id)
    }
    if(!selectedCollection.pins.some(p => p._id === pin._id)) {
      setBtnClass('blackBtn')
      setBtnText('Saved')
      await handleCollectionAdd(selectedCollection._id, pin._id)
    }
    await fetchUserCollections(currUser._id)
    setLoading(false)
  }
  
  useEffect(() => {
    if(!loading && selectedCollection) {
      setBtnClass(selectedCollection.pins.some(p => p._id === pin._id) ? 'blackBtn' : 'redBtn')
      setBtnText(selectedCollection.pins.some(p => p._id === pin._id) ? "Saved" : "Save")
    }
  }, [selectedCollection])

  const handleCollectionName = () => {
    return selectedCollection.name.length < 8 ? selectedCollection.name : selectedCollection.name.substring(0, 8 - 3) + '...'
  }

  return (
    <>
    <div 
      className="pin" 
      onClick={() => navigate(`/pin/${pin._id}`)}
      onMouseEnter={() => setHoverIndex(index)}
      onMouseLeave={() => {
        setShowColModal(null)
        setHoverIndex(null)
      }}>
      {hoverIndex === index && selectedCollection && <CollectionsModal />}
      <div className="pinContent">
        <div className={`pinBackground ${hoverIndex === index ? 'hover' : ''}`}>
          <img 
            className={`pinImg ${hoverIndex === index ? 'hover' : ''}`}
            src={`${import.meta.env.VITE_SERVER_URL}/public/pins/${pin.image}`} 
            alt={pin.title} 
            onLoad={onLoad}
            />
        </div>
        <p className="pinTitle">{pin.title}</p>
        {hoverIndex === index && selectedCollection && currUser &&
        <div className="hoverOptions" onClick={(e) => e.stopPropagation()}>
          <div className="collectionsBtn" 
            onClick={() => {
              setSelectedPinId(pin._id)
              setShowColModal(index)}}>
            <p>{handleCollectionName()}</p>
            <ArrowDownIcon color='white' />
          </div>
          <button 
          className={btnClass} 
          onClick={() => handleBtnClick()}>
          {btnText}
        </button>
        </div>}
      </div>
    </div>
    </>
  )
}