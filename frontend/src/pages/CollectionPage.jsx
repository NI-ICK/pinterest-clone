import { useParams, useNavigate } from "react-router-dom"
import { useCollectionContext } from "../context/CollectionContext"
import { useEffect, useState } from "react"
import { Pin } from "../components/Pin"
import { useUserContext } from "../context/UserContext"

export function CollectionPage() {
  const { id } = useParams()
  const { fetchCollectionById, collection, handleDeleteCollection } = useCollectionContext()
  const { currUser, fetchCurrUser } = useUserContext()
  const [loading, setLoading] = useState(true)
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

  return (
    <>
      {!loading && 
      <div className="currCollection">
        <div className="container">
            <h1>{collection.name}</h1>
            <button className="redBtn" onClick={() => handleDeleteCollection(id)}>Delete</button>
        </div>
        <div className="pins">
        {collection.pins && collection.pins.map((pin, index) => (
          <Pin 
            key={pin._id}
            pin={pin}
            index={index + 1}
          />
        ))}
        </div>
      </div>
      }
    </>
  ) 
}