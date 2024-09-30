import { useNavigate } from "react-router-dom"
import { usePinContext } from "../context/PinContext"

export function DeletePin({ id, modal, showModal, setShowModal }) {
  const { handleDeletePin } = usePinContext()
  const navigate = useNavigate()

  if(!showModal) return null

  return (
    <div className="modal">
      <div className="modalContent delete" ref={modal}>
        <p>Are you sure?</p>
        <div className="buttons">
          <button className='greyBtn' onClick={() => setShowModal(false)}>Cancel</button>
          <button className='redBtn' onClick={() => {
            handleDeletePin(id)
            navigate('/')
          }}>Delete</button>
        </div>
      </div>
    </div>
  )
}