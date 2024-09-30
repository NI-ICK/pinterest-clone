import { useNavigate } from "react-router-dom"
import { useUserContext } from "../context/UserContext"

export function DeleteUser({ modal, showModal, setShowModal }) {
  const { handleDeleteUser } = useUserContext()
  const navigate = useNavigate()

  if(!showModal) return null

  return (
    <div className="modal">
      <div className="modalContent delete" ref={modal}>
        <p>Are you sure?</p>
        <div className="buttons">
          <button className='greyBtn' onClick={() => setShowModal(false)}>Cancel</button>
          <button className='redBtn' onClick={() => {
            handleDeleteUser()
            navigate('/')
          }}>Delete</button>
        </div>
      </div>
    </div>
  )
}