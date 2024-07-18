import { Link, Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useFormDataContext } from '../context/FormDataContext'

export function Settings() {
  const [editActive, setEditActive] = useState(false)
  const [accActive, setAccActive] = useState(false)
  const { formFilled } = useFormDataContext()
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
        <button className={formFilled ? 'redBtn' : 'btnOff'} type="submit" form="editForm">Save</button>
      </div>
    </div>
  )
}