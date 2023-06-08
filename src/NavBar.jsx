import { useState } from 'react'
import Search from './Search'
import Logo from './Logo'
import NumResults from './NumResults'

export default function NavBar({ movies }) {
  const [query, setQuery] = useState('')

  return (
    <nav className='nav-bar'>
      <Logo />
      <Search query={query} setQuery={setQuery} />
      <NumResults movies={movies} />
    </nav>
  )
}
