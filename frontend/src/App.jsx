import './styles/style.scss'
import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { CreatePin } from './pages/CreatePin'
import { UserProfile } from './pages/UserProfile'
import { Pin } from './pages/Pin'
import { NotFound } from './pages/NotFound'
import { Settings} from './pages/Settings'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 300)
  }, [])

  return (
    <>
      <div className={`loadingScreen ${loading ? 'loading' : ''}`}>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/createPin' element={<CreatePin />} />
          <Route path='/:user' element={<UserProfile />}/>
          <Route path='/pin/:id' element={<Pin />}/>
          <Route path='/settings' element={<Settings />}/>
          <Route path='/404' element={<NotFound />}/>
        </Routes>
      </div>
    </>
  )
}

export default App