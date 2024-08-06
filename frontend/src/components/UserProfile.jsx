import { useEffect, useState } from "react"
import { useUserContext } from "../context/UserContext"
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import { usePinContext } from "../context/PinContext"
import { useCollectionContext } from "../context/CollectionContext"

export function UserProfile() {
  const navigate = useNavigate()
  const { username } = useParams()
  const { users, fetchUsers, fetchCurrUser, currUser, user, fetchUser } = useUserContext()
  const { fetchCreatedPins } = usePinContext()
  const { fetchUserCollections, setSelectedCollection, collections } = useCollectionContext()
  const [loading, setLoading] = useState(true)
  const [savedActive, setSavedActive] = useState(false)
  const [createdActive, setCreatedActive] = useState(false)
  const [areCollectionsFetched, setAreCollectionsFetched] = useState(false)
  const location = useLocation()
  const path = location.pathname

  useEffect(() => {
    setSavedActive(path === `/${username}/saved` || path === `/${username}`)
    setCreatedActive(path === `/${username}/created`)
  }, [location])

  const loadUserData = async () => {
    await fetchUsers()
    await fetchCurrUser() 
    await fetchUser(username)
  }

  const loadPinData = async () => {
    if(user) {
      await fetchUserCollections(user._id)
      setAreCollectionsFetched(true)
      await fetchCreatedPins(user._id)
      setLoading(false)
    }
  }

  useEffect(() => {
    setSelectedCollection(collections[0])
  }, [areCollectionsFetched])

  useEffect(() => {
    loadUserData()
  }, [username])

  useEffect(() => {
    loadPinData()
  }, [user])

  useEffect(() => {
    if(!loading) {
      if(!user) navigate('/404')
    }
  }, [users, loading, user])

  if(!user) return null

  return (
    <>
    {!loading && 
      <div className="userProfile">
        <div className="userDetails">
          <img className='photo' src={user.photo ? `${process.env.SITE_URL}/public/photos/${user.photo}` : `${process.env.SITE_URL}/public/photos/noPhoto.jpg`} />
          <p className="username">{user.username}</p>
          <p>{user.about}</p>
          {currUser._id === user._id ? <button className="greyBtn" onClick={() => navigate('/settings')}>Edit Profile</button> : null}
          <ul>
            <li><Link to='created' className={createdActive ? 'active' : ''}>Created</Link></li>
            <li><Link to='saved' className={savedActive ? 'active' : ''}>Saved</Link></li>
          </ul>
        </div>
        <Outlet />
      </div>
    }
    </>
  )
}