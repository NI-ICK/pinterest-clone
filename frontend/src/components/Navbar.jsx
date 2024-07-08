import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Login } from './Login'
import { Register } from './Register'
import { useUserContext } from '../context/UserContext'
import { SettingsWindow } from './SettingsWindow'
import { SearchBar } from './SearchBar'
import { SettingsIcon } from '../assets/SettingsIcon'

export function Navbar() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [homeActive, setHomeActive] = useState(false)
  const [createActive, setCreateActive] = useState(false)
  const modalRef = useRef()
  const { currUser } = useUserContext()
  const navigate = useNavigate()
  const location = useLocation()

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

  const handleNavigation = (url) => {
    navigate(url)
    if(url !== '/' || url !== 'pin-creation-tool') {
      setCreateActive(false)
      setHomeActive(false)
    }
  }

  const checkLocation = () => {
    setHomeActive(location.pathname === '/')
    setCreateActive(location.pathname === '/pin-creation-tool')
  }

  useEffect(() => {
    checkLocation()
  }, [location])

  return (
    <nav>
      <Link to="/" className={homeActive ? 'active' : ''}>Home</Link>
      {currUser ? (
      <>
        <Link to="/pin-creation-tool" className={createActive ? 'active' : ''}>Create</Link>
        <SearchBar />
        <div className='profileBackground' onClick={() => handleNavigation(`${currUser.username}`)}>
          <div className='profile'>
            <img src={currUser.photo ? `https://localhost:5000/public/photos/${currUser.photo}` : `https://localhost:5000/public/photos/noPhoto.jpg`}/>
          </div>
        </div>
        <div className='settingsIcon' onClick={() => setShowSettings(!showSettings)}><SettingsIcon /></div>
        <SettingsWindow show={showSettings} setShow={setShowSettings} handleNavigation={handleNavigation}/>
      </>
      ) : (
      <> 
        <SearchBar />
        <button className='redBtn' onClick={() => {setShowLoginModal(!showLoginModal), setShowSettings(false)}}>Login</button>
        <Login showModal={showLoginModal} modalRef={modalRef} setShowLoginModal={setShowLoginModal} />
        <button className='greyBtn' onClick={() => {setShowRegisterModal(!showRegisterModal), setShowSettings(false)}}>Register</button>
        <Register showModal={showRegisterModal} modalRef={modalRef} setShowRegisterModal={setShowRegisterModal}/>
      </>
      )}
    </nav>
  )
}