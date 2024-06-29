import { SearchIcon } from '../assets/SearchIcon'

export function SearchBar() {

  return (
    <div className="search-bar">      
      <SearchIcon />
      <input type="text" placeholder='Search'/>
    </div>
  )
}