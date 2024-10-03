import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useUserContext } from '../context/UserContext'
import { Login } from './Login'
import { Register } from './Register'
import { LogoutIcon } from '../assets/LogoutIcon'
import { LogoutPopup } from './LogoutPopup'

export function NavbarMobile() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [createActive, setCreateActive] = useState(false)
  const [settingsActive, setSettingsActive] = useState(false)
  const [ showLogoutModal, setShowLogoutModal ] = useState(false)
  const modalRef = useRef()
  const { currUser, noUserImgUrl, logoutUser } = useUserContext()
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname

  useEffect(() => {
    if(showLoginModal || showRegisterModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLoginModal, showRegisterModal])

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowRegisterModal(false)
      setShowLoginModal(false)
    }
  }

  useEffect(() => {
    if(path === '/pin-creation-tool') setCreateActive(true)
    if(path === '/settings') setCreateActive(true)
  }, [location])

  const checkLocation = () => {
    setCreateActive(location.pathname === '/pin-creation-tool')
    setSettingsActive(location.pathname.startsWith('/settings'))
  }

  useEffect(() => {
    checkLocation()
  }, [location])

  return (
    <>
    <LogoutPopup  modalRef={modalRef} showModal={showLogoutModal} setShowModal={setShowLogoutModal}/>
    <nav className='mobileNav'>
      <>
      {currUser ? ( <>
        <Link to="/pin-creation-tool" className={createActive ? 'active' : ''}>Create</Link>
        <div className='profileBackground' onClick={() => navigate(`/${currUser.username}`)}>
          <div className='profile' tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter') e.target.click() }} >
            <img draggable={false} src={currUser.photo ? currUser.photo : noUserImgUrl}/>
          </div>
        </div>
        <LogoutIcon onClick={() => setShowLogoutModal(true)}/>
        <Link to="/settings" className={settingsActive ? 'active' : ''}>Settings</Link>
      </> ) : ( <> 
        <button className='redBtn' onClick={() => {setShowLoginModal(!showLoginModal), setShowSettings(false)}}>Login</button>
        <Login showModal={showLoginModal} modalRef={modalRef} setShowLoginModal={setShowLoginModal} />
        <button className='greyBtn' onClick={() => {setShowRegisterModal(!showRegisterModal), setShowSettings(false)}}>Register</button>
        <Register showModal={showRegisterModal} modalRef={modalRef} setShowRegisterModal={setShowRegisterModal}/>
      </> )}
    </>
    </nav>
    </>
  )
}