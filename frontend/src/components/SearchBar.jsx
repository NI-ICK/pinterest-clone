import { SearchIcon } from '../assets/SearchIcon'

export function SearchBar() {

  return (
    <div className="searchBar">      
      <SearchIcon />
      <input type="text" placeholder='Search'/>
    </div>
  )
}