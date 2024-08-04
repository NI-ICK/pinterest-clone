import { useEffect, useState } from "react"
import { useCollectionContext } from "../context/CollectionContext"
import { usePinContext } from "../context/PinContext"
import { useFormDataContext } from "../context/FormDataContext"
import { useUserContext } from "../context/UserContext"

export function CreateCollection() {
  const { selectedPinId, setShowCreateCol, showCreateCol, modalRef, fetchUserCollections } = useCollectionContext() 
  const { handleCreateCollectionChange, handleCreateCollectionSubmit, formData } = useFormDataContext()
  const { currUser } = useUserContext()
  const { pins } = usePinContext()
  const [pin, setPin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(pins) {
      setPin(pins.find(pin => pin._id === selectedPinId))
      setLoading(false)
    }
  }, [selectedPinId])

  if(!showCreateCol) return null

  const formSubmit = async (e) => {
    e.preventDefault()
    await handleCreateCollectionSubmit(selectedPinId)
    setShowCreateCol(false)
    await fetchUserCollections(currUser._id)
  }

  return (
    <>
    {!loading &&
      <div className="modal">
        <div className="modalContent createCol" ref={modalRef}>
          <h1>Create Collection</h1>
          <div className="content">
            {selectedPinId && <img src={`https://localhost:5000/public/pins/${pin.image}`}  />}
            <form onSubmit={formSubmit} id="createColForm" className="fInput">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" placeholder="Collection name" value={formData.name} onChange={handleCreateCollectionChange} required/>
            </form>
          </div>
          <div className="colButtons">
            <button onClick={() => setShowCreateCol(false)} className="greyBtn">Cancel</button>
            <button form="createColForm" type="submit" className="redBtn">Create</button>
          </div>
        </div>
      </div>
    }
    </>
  )
}                                         