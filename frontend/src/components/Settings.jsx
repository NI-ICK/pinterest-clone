import { Link, Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useFormDataContext } from '../context/FormDataContext'
import { useUserContext } from '../context/UserContext'

export function Settings() {
  const [editActive, setEditActive] = useState(false)
  const [accActive, setAccActive] = useState(false)
  const { formFilled } = useFormDataContext()
  const { fetchCurrUser } = useUserContext()
  const location = useLocation()
  const path = location.pathname

  const loadData = async () => {
    await fetchCurrUser()
  }

  useEffect(() => {
    setEditActive(path === '/settings/edit-profile' || path === '/settings')
    setAccActive(path === '/settings/account-settings')
  }, [location])

  useEffect(() => {
    loadData()
  }, [])
 
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