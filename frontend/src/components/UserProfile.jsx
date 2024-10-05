import { useEffect, useState } from "react"
import { useUserContext } from "../context/UserContext"
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import { usePinContext } from "../context/PinContext"
import { useCollectionContext } from "../context/CollectionContext"

export function UserProfile() {
    const navigate = useNavigate()
    const { username } = useParams()
    const { fetchUsers, fetchCurrUser, currUser, user, fetchUser, noUserImgUrl } = useUserContext()
    const { fetchCreatedPins } = usePinContext()
    const { fetchUserCollections, setSelectedCollection, collections } = useCollectionContext()
    const [loading, setLoading] = useState(true)
    const [savedActive, setSavedActive] = useState(false)
    const [createdActive, setCreatedActive] = useState(false)
    const [areCollectionsFetched, setAreCollectionsFetched] = useState(false)
    const location = useLocation()
    const path = location.pathname
    const decodedPath = decodeURIComponent(path).replace(/^\/|\/$/g, '')
    
    useEffect(() => {
        setSavedActive(path.endsWith('/saved') || decodedPath === username)
        setCreatedActive(path.endsWith('/created'))
    }, [location])
    
    const loadUserData = async () => {
        await fetchUsers()
        await fetchCurrUser() 
        const foundUser = await fetchUser(username)
        if(!foundUser) return navigate('/404')
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
    
    if(!user) return null
    
    return (
        <>
        {!loading && 
            <div className="userProfile">
            <div className="userDetails">
            <img draggable={false} className='photo' src={user.photo ? user.photo : noUserImgUrl} />
            <p className="username">{user.username}</p>
            <p>{user.about}</p>
            {currUser && currUser._id === user._id ? <button className="greyBtn" onClick={() => navigate('/settings')} tabIndex={0} onKeyDown={(e) => { if(e.key === 'Enter') e.target.click() }}>Edit Profile</button> : null}
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