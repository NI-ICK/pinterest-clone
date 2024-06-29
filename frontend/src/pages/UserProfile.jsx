import { useEffect } from "react"
import { useUserContext } from "../context/UserContext"
import { useNavigate, useParams } from "react-router-dom"

export function UserProfile() {
  const navigate = useNavigate()
  const { user } = useParams()
  const { users, userLoading } = useUserContext()

  const profile = users.find(u => u.username === user) 

  useEffect(() => {
    if(!profile && !userLoading) navigate('/404')
  }, [])

  if(!profile) return null

  return (
    <h1>{profile.username}</h1>
  )
}