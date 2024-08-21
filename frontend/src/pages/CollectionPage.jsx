import { useParams, useNavigate } from "react-router-dom"
import { useCollectionContext } from "../context/CollectionContext"
import { useEffect, useState } from "react"
import { Pin } from "../components/Pin"
import { usePinContext } from "../context/PinContext"
import { useUserContext } from "../context/UserContext"

export function CollectionPage() {
  const { id } = useParams()
  const { fetchCollectionById, collection } = useCollectionContext()
  const { adjustGridRows } = usePinContext()
  const { currUser, fetchCurrUser } = useUserContext()
  const [loading, setLoading] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState(0)
  const navigate = useNavigate()

  const loadData = async () => {
    if(!currUser) await fetchCurrUser()
    const foundCol = await fetchCollectionById(id)
    if(!foundCol) return navigate('/404')
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
            index={index + 1}
            onLoad={handleImageLoad} 
          />
        ))}
        </div>
      </div>
      }
    </>
  ) 
}