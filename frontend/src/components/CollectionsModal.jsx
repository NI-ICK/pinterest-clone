import { useCollectionContext } from "../context/CollectionContext"
import { useEffect, useState } from "react"
import { XIcon } from "../assets/XIcon"
import { usePinContext } from "../context/PinContext"

export function CollectionsModal() {
  const { collections, setSelectedCollection, showColModal, setShowCreateCol, modalRef, noColImgUrl } = useCollectionContext()
  const { pinModal } = usePinContext()
  const [style, setStyle] = useState()
  const styleBase = {
    top: '60px',
    left: '50%',
    transform: 'translateX(-50%)',
  }
  const stylePin = {
    right: '-50px',
    top: '70px',
  }
  
  useEffect(() => {
    if(!pinModal) setStyle(styleBase)
    if(pinModal) setStyle(stylePin)
  }, [pinModal])

  return (
    <>
    {showColModal &&
      <div ref={modalRef} style={style} onClick={(e) => e.stopPropagation()} className="collectionsContainer">
        <p className="colTitle">Save</p>
        <div className="collections">
        {collections && collections.map((collection, index) => {
          return (
            <div 
              key={index} 
              onClick={() => {
                setSelectedCollection(collection)}}
              className="collection">
                <img src={collection.pins.length > 0 ? collection.pins[collection.pins.length - 1].image : noColImgUrl}/>
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