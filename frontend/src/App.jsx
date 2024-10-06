import './styles/style.scss'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { NavbarMobile } from './components/NavbarMobile'
import { Home } from './pages/Home'
import { CreatePin } from './pages/CreatePin'
import { UserProfile } from './components/UserProfile'
import { PinPage } from './pages/PinPage'
import { NotFound } from './pages/NotFound'
import { Settings } from './components/Settings'
import { EditProfile } from './pages/EditProfile'
import { AccountSettings } from './pages/AccountSettings'
import { SavedPins } from './pages/SavedPins'
import { CreatedPins } from './pages/CreatedPins'
import { CollectionPage } from './pages/CollectionPage'
import { SearchedPins } from './pages/SearchedPins'
import axios from 'axios'

export function App() {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL

  return (
    <>
      <NavbarMobile />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/search/:query' element={<SearchedPins />}/>
        <Route path='/pin-creation-tool' element={<CreatePin />} />
        <Route path='/pin/:id' element={<PinPage />}/>
        <Route path='/:username' element={<UserProfile />}>
          <Route index element={<SavedPins />}/>
          <Route path='created' element={<CreatedPins />}/>
          <Route path='saved' element={<SavedPins />}/>
        </Route>
        <Route path='/collection/:id' element={<CollectionPage />}/>
        <Route path='/settings' element={<Settings />}>
          <Route index element={<EditProfile />}/>
          <Route path='edit-profile' element={<EditProfile />}/>
          <Route path='account-settings' element={<AccountSettings />}/>
        </Route>
        <Route path='/404' element={<NotFound />}/>
      </Routes>
    </>
  )
}