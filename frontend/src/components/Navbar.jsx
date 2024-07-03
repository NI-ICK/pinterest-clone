import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const [homeActive, setHomeActive] = useState(true)
  const [createActive, setCreateActive] = useState(false)
  const modalRef = useRef()
  const { currUser } = useUserContext()
  const navigate = useNavigate()

  useEffect(() => {
    if(showLoginModal || showRegisterModal || showSettings) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLoginModal, showRegisterModal, showSettings])

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowRegisterModal(false)
      setShowLoginModal(false)
      setShowSettings(false)
    }
  }

  return (
    <nav>
      <Link 
        to="/" 
        onClick={() => { 
          setHomeActive(true)
          setCreateActive(false)
        }}
        className={homeActive ? 'active' : ''}
        >Home</Link>
      {currUser ? (
      <>
        <Link 
          to="/createPin" 
          onClick={() => { 
            setCreateActive(true)
            setHomeActive(false)
          }}
          className={createActive ? 'active' : ''}
          >Create</Link>
          <SearchBar />
        <div className='profile-background'>
          <div 
            className='profile' 
            onClick={() => navigate(`${currUser.username}`)}
            style={{ backgroundImage: currUser.avatar ? `url(https://localhost:5000/public/avatars/${currUser.avatar})` : `url(https://localhost:5000/public/avatars/noAvatar.jpg)` }}>
          </div>
        </div>
        <div className='settingsIcon' onClick={() => setShowSettings(!showSettings)}><SettingsIcon /></div>
        <SettingsWindow show={showSettings} modalRef={modalRef}/>
      </>
      ) : (
      <> 
        <SearchBar />
        <button onClick={() => {setShowLoginModal(!showLoginModal), setShowSettings(false)}}>Login</button>
        <Login showModal={showLoginModal} modalRef={modalRef} setShowLoginModal={setShowLoginModal} />
        <button onClick={() => {setShowRegisterModal(!showRegisterModal), setShowSettings(false)}}>Register</button>
        <Register showModal={showRegisterModal} modalRef={modalRef} setShowRegisterModal={setShowRegisterModal}/>
      </>
      )}
    </nav>
  )
}