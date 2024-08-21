import { usePinContext } from "../context/PinContext"
import { useState, useEffect } from "react"
import { Pin } from '../components/Pin'
import { useParams } from "react-router-dom"
import { useCollectionContext } from "../context/CollectionContext"
import { useUserContext } from "../context/UserContext"
import { CreateCollection } from "../components/CreateCollection"

export function SearchedPins() {
  const { searchedPins, adjustGridRows, fetchSearchedPins } = usePinContext()
  const [imagesLoaded, setImagesLoaded] = useState(0)
  const { collections, setSelectedCollection, fetchUserCollections } = useCollectionContext()
  const { currUser, fetchCurrUser } = useUserContext()
  const { query } = useParams()
  const [isUserFetched, setIsUserFetched] = useState(false)
  const [areCollectionsFetched, setAreCollectionsFetched] = useState(false)

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1)
  }

  useEffect(() => {
    if (searchedPins && imagesLoaded === searchedPins.length) {
      adjustGridRows()
    }
  }, [imagesLoaded, searchedPins])

  const loadData = async () => {
    if(!currUser) {
      await fetchCurrUser()
      setIsUserFetched(true)
    }
    await fetchSearchedPins(query)
  }

  const loadColData = async () => {
    if(isUserFetched) {
      await fetchUserCollections(currUser._id)
      setAreCollectionsFetched(true)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadColData()
  }, [isUserFetched])

  useEffect(() => {
    setSelectedCollection(collections[0])
  }, [areCollectionsFetched])

  return (
    <>
    <CreateCollection />
    <div className="pins">
      {searchedPins && searchedPins.map((pin, index) => (
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