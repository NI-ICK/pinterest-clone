import { useContext, useState, createContext, useEffect, useRef } from "react"
import axios from "axios"

const CollectionContext = createContext()

export function useCollectionContext() {
  return useContext(CollectionContext)
}

export function CollectionContextProvider({ children }) {
  const [collections, setCollections] = useState([])
  const [selectedPinId, setSelectedPinId] = useState(null)
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [showColModal, setShowColModal] = useState(null)
  const [showCreateCol, setShowCreateCol] = useState(false)
  const [collection, setCollection] = useState(null)
  const modalRef = useRef()
  const noColImgUrl = 'https://res.cloudinary.com/dzg5ek6qa/image/upload/v1723557472/noCollectionImg_ujjhcl.webp'

  useEffect(() => {
    if(showCreateCol || showColModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCreateCol, showColModal])

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowCreateCol(false)
      setShowColModal(false)
    }
  }

  const fetchUserCollections = async (id) => {
    try {
      const response = await axios.get(`/collections`, { params: { id }})
      setCollections(response.data)
    } catch(error) {
      console.log("Error fetching collections: ", error)
    }
  }

  const fetchCollectionById = async (id) => {
    try {
      const response = await axios.get(`/collections/id/${id}`)
      setCollection(response.data)
      if(!response.data) return false
      return true
    } catch(error) {
      console.log("Error fetching collection: ", error)
    }
  }

  const handleCollectionAdd = async (id, pinId) => {
    try {
      await axios.post(`/collections/add`, { id, pinId })
      const updatedCollection = await fetchCollectionById(id)
      setSelectedCollection(updatedCollection)
    } catch(error) {
      console.log("Error adding to collection: ", error)
    }
  }

  const handleCollectionRemove = async (id, pinId) => {
    try {
      await axios.post(`/collections/remove`, { id, pinId })
      const updatedCollection = await fetchCollectionById(id)
      setSelectedCollection(updatedCollection)
    } catch(error) {
      console.log("Error removing from collection: ", error)
    }
  }

  return (
    <CollectionContext.Provider value={{
      collections,
      selectedPinId,
      setSelectedPinId,
      handleCollectionAdd,
      handleCollectionRemove,
      selectedCollection,
      setSelectedCollection,
      showColModal,
      setShowColModal,
      showCreateCol,
      setShowCreateCol,
      modalRef,
      fetchUserCollections,
      fetchCollectionById,
      collection,
      noColImgUrl
      }}>
      {children}
    </CollectionContext.Provider>
  )
}