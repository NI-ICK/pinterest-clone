import { useUserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"

export function SettingsWindow({ show, modalRef }) {
  const { logoutUser } = useUserContext()
  const navigate = useNavigate()

  if(!show) return null
  
  return (
    <div className="settings-background">
      <div className="settings" ref={modalRef}>
        <div onClick={() => navigate('/settings')}>Settings</div>
        <div onClick={() => logoutUser()}>Log out</div>
      </div>
    </div>
  )
}