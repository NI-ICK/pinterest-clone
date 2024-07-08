import { Link, Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export function Settings() {
  const [editActive, setEditActive] = useState(false)
  const [accActive, setAccActive] = useState(false)
  const location = useLocation()
  
  const checkLocation = () => {
    setEditActive(location.pathname === '/settings/edit-profile')
    setAccActive(location.pathname === '/settings/account-settings')
  }

  useEffect(() => {
    checkLocation()
  }, [location])

  return (
    <div className="settings">
      <ul>
        <li><Link to='/settings/edit-profile' className={editActive ? 'active' : ''}>Edit Profile</Link></li>
        <li><Link to='/settings/account-settings' className={accActive ? 'active' : ''}>Account Menagement</Link></li>
      </ul>
      <Outlet />
      <div className="settingsFooter">
        <button className="redBtn" type="submit" form="editForm">Save</button>
      </div>
    </div>
  )
}