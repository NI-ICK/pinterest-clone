import { useUserContext } from "../context/UserContext"

export function SettingsWindow({ show, setShow, handleNavigation }) {
  const { logoutUser } = useUserContext()

  if(!show) return null
  
  return (
    <div className="settingsBackground" onClick={() => setShow(false)} >
      <div className="settingsModal">
        <div onClick={() => handleNavigation('/settings/edit-profile')}>Settings</div>
        <div onClick={() => {
          logoutUser()
          handleNavigation('/')
        }}>Log out</div>
      </div>
    </div>
  )
}