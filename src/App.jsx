import { useState, useEffect } from 'react'
import NavBar from './NavBar'
import Main from './Main'
import Search from './Search'
import NumResults from './NumResults'
import Box from './Box'
import MovieList from './MovieList'
import WatchedSummary from './WatchedSummary'
import WatchedMoviesList from './WatchedMoviesList'
import Loader from './Loader'
import ErrorMessage from './ErrorMessage'
import MovieDetails from './MovieDetails'

const key = '8cc41363'

export default function App() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [watched, setWatched] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  function handleSelectMovie(id) {
    setSelectedId(selectedId => (id === selectedId ? null : id))
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie])
  }

  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id))
  }

  useEffect(() => {
    const controller = new AbortController()

    async function fetchMovies() {
      try {
        setIsLoading(true)
        setError('')
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
          { signal: controller.signal }
        )

        if (!res.ok)
          throw new Error('Something went wrong with fetching movies.')

        const data = await res.json()

        if (data.Response === 'False') throw new Error('Movie Not Found')

        setMovies(data.Search)
        setError('')
      } catch (err) {
        console.error(err.message)
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (!query.length) {
      setMovies([])
      setError('')
      return
    }

    handleCloseMovie()
    fetchMovies()

    return function () {
      controller.abort()
    }
  }, [query])

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  )
}
