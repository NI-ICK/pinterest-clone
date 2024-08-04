import { useParams } from "react-router-dom"
import { useCollectionContext } from "../context/CollectionContext"
import { useEffect, useState } from "react"
import { Pin } from "../components/Pin"
import { usePinContext } from "../context/PinContext"

export function CollectionPage() {
  const { id } = useParams()
  const { fetchCollectionById, collection } = useCollectionContext()
  const { adjustGridRows } = usePinContext()
  const [loading, setLoading] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState(0)

  const loadData = async () => {
    await fetchCollectionById(id)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!loading && imagesLoaded === collection.pins.length) {
      adjustGridRows()
    }
  }, [loading, imagesLoaded, collection])

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1)
  }

  return (
    <>
      {!loading && 
      <div className="currCollection">
        <h1>{collection.name}</h1>
        <div className="pins">
        {collection.pins && collection.pins.map((pin, index) => (
          <Pin 
            key={pin._id}
            pin={pin}
            index={index}
            onLoad={handleImageLoad} 
          />
        ))}
        </div>
      </div>
      }
    </>
  ) 
}