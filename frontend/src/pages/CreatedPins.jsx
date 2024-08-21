import { usePinContext } from "../context/PinContext"
import { Pin } from '../components/Pin'
import { useEffect, useState } from "react"
import { CreateCollection } from "../components/CreateCollection"

export function CreatedPins() {
  const { createdPins, adjustGridRows } = usePinContext()
  const [imagesLoaded, setImagesLoaded] = useState(0)

  useEffect(() => {
    if (imagesLoaded === createdPins.length) {
      adjustGridRows()
    }
  }, [imagesLoaded, createdPins])

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1)
  }
  
  return (
    <>
    <CreateCollection />
    <div className="pins" >
    {createdPins.map((pin, index) => (
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