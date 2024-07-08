import { usePinContext } from '../context/PinContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useUserContext } from '../context/UserContext'
import { useEffect, useState } from 'react'

export function Pin() {
  const { id } = useParams()
  const { pins, pinLoading } = usePinContext()
  const { users } = useUserContext()
  const navigate = useNavigate()
  const [show, setShow] = useState(false)

  const pin = pins.find(pin => pin._id === id)
  let user = users.find(user => user.username === pin.user)

  if(!user) user = { username: 'User deleted' }

  useEffect(() => {
    if(!pinLoading && !pin) navigate('/404')
  }, [])

  if(!pin) return null

  return (
    <div className="pinContainer">
      <img src={`https://localhost:5000/public/pins/${pin.image}`} alt={pin.title} />
      <div className="pinDetails">
        <div className="pinOptions" onClick={() => setShow(true)}>...
          {show && <div>...</div>}
        </div>
        <h2>{pin.title}</h2>
        <p>{pin.decription}</p>
        <div className="user" onClick={() => navigate(`/${user.username}`)}>
          <p>{user.username}</p>
        </div>
        <div className="comments"></div>
      </div>
    </div>
  )
}