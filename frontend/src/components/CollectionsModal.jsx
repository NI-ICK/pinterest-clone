import { useCollectionContext } from "../context/CollectionContext"
import { useEffect, useState } from "react"
import { XIcon } from "../assets/XIcon"
import { usePinContext } from "../context/PinContext"

export function CollectionsModal() {
  const { collections, setSelectedCollection, showColModal, setShowCreateCol, modalRef, noColImgUrl, setShowColModal, selectedCollection } = useCollectionContext()
  const { pinModal } = usePinContext()
  const [style, setStyle] = useState()
  const [ isMobile, setIsMobile ] = useState(false)
  const styleBase = { 
    top: '3.75rem',
    left: '50%',
    transform: 'translateX(-50%)',
  }
  const stylePin = {
    right: '-3.1rem',
    top: '4.4rem',
  }

  useEffect(() => {
    if(window.innerWidth < 500) setIsMobile(true)
  }, [])
  
  useEffect(() => {
    if(!pinModal) setStyle(styleBase)
    if(pinModal) setStyle(stylePin)
  }, [pinModal])

  useEffect(() => {
    setShowColModal(false)
  }, [selectedCollection])

  return (
    <>
    {showColModal &&
      <div ref={modalRef} style={style} onClick={(e) => e.stopPropagation()} className={`collectionsContainer ${isMobile ? 'mobile' : ''}`}>
        <p className="colTitle">Save</p>
        <div className="collections">
        {collections && collections.map((collection, index) => {
          return (
            <div 
              key={index} 
              onClick={() => {
                setSelectedCollection(collection)}}
              className="collection">
                <img draggable={false} src={collection.pins.length > 0 ? collection.pins[collection.pins.length - 1].image : noColImgUrl}/>
              <p>{collection.name}</p>
            </div>
          )})}
          </div>
        <div className="createCollectionBtn" onClick={() => setShowCreateCol(true)}><XIcon color='black'/>Create Collection</div>
      </div>
    }
  </>
  )
}