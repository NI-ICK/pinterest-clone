import { useNavigate } from "react-router-dom"
import { useUserContext } from "../context/UserContext"

export function LogoutPopup({ modal, showModal, setShowModal }) {
  const { logoutUser } = useUserContext()
  const navigate = useNavigate()

  if(!showModal) return null

  return (
    <div className="modal">
      <div className="modalContent delete" ref={modal}>
        <p>Do you want to logout?</p>
        <div className="buttons">
          <button className='greyBtn' onClick={() => setShowModal(false)}>Cancel</button>
          <button className='redBtn' onClick={() => {
            logoutUser()
            setShowModal(false)
            navigate('/')
          }}>Logout</button>
        </div>
      </div>
    </div>
  )
}