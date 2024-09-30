import { useNavigate } from "react-router-dom"
import { useUserContext } from "../context/UserContext"

export function SettingsWindow({ show, setShow }) {
  const { logoutUser } = useUserContext()
  const navigate = useNavigate()

  if(!show) return null
  
  return (
    <div className="settingsBackground" onClick={() => setShow(false)} >
      <div className="settingsModal">
        <div onClick={() => navigate('/settings')} tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter') navigate('/settings')}} >Settings</div>
        <div onClick={() => {
          logoutUser()
          navigate('/')
        }}
        tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter') navigate('/settings')}}
        >Log out</div>
      </div>
    </div>
  )
}