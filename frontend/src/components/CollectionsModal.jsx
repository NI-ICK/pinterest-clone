import { useLocation } from "react-router-dom"
import { useCollectionContext } from "../context/CollectionContext"
import { useEffect, useState } from "react"
import { XIcon } from "../assets/XIcon"

export function CollectionsModal({ hoverIndex }) {
  const { collections, setSelectedCollection, showColModal, setShowCreateCol, modalRef } = useCollectionContext()
  const location = useLocation()
  const path = location.pathname
  const [style, setStyle] = useState()
  const styleBase = {
    top: '60px',
    left: '50%',
    transform: 'translateX(-50%)',
    position: "absolute",
    backgroundColor: "white",
    padding: "1em",
    zIndex: 1000,
    width: '320px',
    height: '400px',
    boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.3)',
    borderRadius: '24px',
    color: 'black',
  }
  const stylePin = {
    right: '-50px',
    top: '70px',
    position: "absolute",
    backgroundColor: "white",
    padding: "1em",
    zIndex: 1000,
    width: '320px',
    height: '400px',
    boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.3)',
    borderRadius: '24px',
    color: 'black',
  }

  useEffect(() => {
    setStyle(styleBase)
    if(path.startsWith('/pin/')) setStyle(stylePin)
  }, [location])

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
                <img src={collection.pins.length > 0 ? `https://pinterest-j71p.onrender.com/public/pins/${collection.pins[collection.pins.length - 1].image}` : `https://pinterest-j71p.onrender.com/public/noCollectionImg.webp`}/>
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