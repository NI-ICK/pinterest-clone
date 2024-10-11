import { useEffect, useState } from 'react'
import { SearchIcon } from '../assets/SearchIcon'
import { usePinContext } from '../context/PinContext'
import { useLocation, useNavigate } from 'react-router-dom'

export function SearchBar() {
  const { setSearchedPins } = usePinContext()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleKeyPress = async (e) => {
    if(e.key === 'Enter') {
      if(query === '') return navigate('/')
      setSearchedPins({})
      navigate(`/search/${query}`)
    }
  }

  const handleInputChange = (e) => {
    setQuery(e.target.value)
  }

  useEffect(() => {
    setQuery('')
  }, [location])

  return (
    <div className="searchBar">      
      <SearchIcon />
      <input type="text" placeholder='Search' value={query} onChange={handleInputChange} onKeyUp={handleKeyPress}/>
    </div>
  )
}