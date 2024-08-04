import { usePinContext } from "../context/PinContext"
import { Pin } from '../components/Pin'
import { useEffect, useState } from "react"

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