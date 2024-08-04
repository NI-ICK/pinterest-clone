import { usePinContext } from "../context/PinContext"
import { useState, useEffect } from "react"
import { CreateCollection } from "../components/CreateCollection"
import { Pin } from '../components/Pin'
import { useCollectionContext } from "../context/CollectionContext"
import { useUserContext } from "../context/UserContext"

export function Home() {
  const { pins, fetchPins, adjustGridRows } = usePinContext()
  const { fetchUserCollections, collections, setSelectedCollection } = useCollectionContext()
  const { currUser, fetchCurrUser } = useUserContext()
  const [loading, setLoading] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState(0)
  const [isUserFetched, setIsUserFetched] = useState(false)
  const [areCollectionsFetched, setAreCollectionsFetched] = useState(false)

  const loadUserData = async () => {
    await fetchPins()
    await fetchCurrUser()
    setIsUserFetched(true)
  }

  const loadColData = async () => {
    if(currUser && isUserFetched) {
      await fetchUserCollections(currUser._id)
      setAreCollectionsFetched(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    setSelectedCollection(collections[0]) 
  }, [areCollectionsFetched])

  useEffect(() => {
    loadColData()
  }, [isUserFetched])

  useEffect(() => {
    loadUserData()
  }, [])

  useEffect(() => {
    if (!loading && imagesLoaded === pins.length) {
      adjustGridRows()
    }
  }, [loading, imagesLoaded, pins])

  useEffect(() => {
    adjustGridRows()
  }, [pins])

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1)
  }

  return (
    <>
      <CreateCollection />
      {!loading && 
        <div className="pins" >
        {pins.map((pin, index) => (
          <Pin 
            key={pin._id}
            pin={pin} 
            index={index + 1} 
            onLoad={handleImageLoad} 
          />
        ))}
        </div>
      }
    </>
  )
}
