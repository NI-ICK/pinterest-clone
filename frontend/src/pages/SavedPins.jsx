import { usePinContext } from "../context/PinContext"
import { Pin } from '../components/Pin'
import { useEffect, useState } from "react"
import { useCollectionContext } from "../context/CollectionContext"
import { useNavigate } from "react-router-dom"
import { CreateCollection } from "../components/CreateCollection"
import { XIcon } from "../assets/XIcon"

export function SavedPins() {
  const { adjustGridRows } = usePinContext()
  const { collections, setShowCreateCol } = useCollectionContext()
  const [imagesLoaded, setImagesLoaded] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (imagesLoaded === collections[0].pins.length) {
      adjustGridRows()
    }
  }, [imagesLoaded, collections])

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1)
  }
  
  return (
    <>
    <CreateCollection />
    <button className='createColBtn' onClick={() => setShowCreateCol(true)}><XIcon color='grey'/></button>
    <div className="userCollections">
      {collections.slice(1).map((collection, index) => (
        <div key={index} className="userCollection" onClick={() => navigate(`/collection/${collection._id}`)}>
          <img className='colImg1' src={collection.pins.length > 0 ? `https://pinterest-j71p.onrender.com/public/pins/${collection.pins[collection.pins.length - 1].image}` : `https://pinterest-j71p.onrender.com/public/noCollectionImg.webp`}/>
          <img className='colImg2' src={collection.pins.length > 1 ? `https://pinterest-j71p.onrender.com/public/pins/${collection.pins[collection.pins.length - 2].image}` : `https://pinterest-j71p.onrender.com/public/noCollectionImg.webp`}/>
          <img className='colImg3' src={collection.pins.length > 2 ?`https://pinterest-j71p.onrender.com/public/pins/${collection.pins[collection.pins.length - 3].image}` : `https://pinterest-j71p.onrender.com/public/noCollectionImg.webp`}/>
          <p>{collection.name}</p>
        </div>
      ))}
    </div>
    <div className="pins" >
    {collections[0].pins.map((pin, index) => (
      <Pin 
        key={pin._id}
        pin={pin}
        index={index + 1}
        onLoad={handleImageLoad}
      />
    ))}
    </div>
    </>
  )
}