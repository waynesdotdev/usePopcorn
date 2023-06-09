import { useState, useEffect } from 'react'
import StarRating from './StarRating'
import Loader from './Loader'

const key = '8cc41363'

export default function MovieDetails({
  selectedId,
  onAddWatched,
  onCloseMovie,
  watched,
}) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState('')

  const isWatched = watched.map(movie => movie.imdbID).includes(selectedId)
  const watchedUserRating = watched.find(
    movie => movie.imdbID === selectedId
  )?.userRating

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true)
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
      )
      const data = await res.json()
      setMovie(data)
      setIsLoading(false)
    }
    getMovieDetails()
  }, [selectedId])

  useEffect(() => {
    if (!title) return
    document.title = `Movie | ${title}`

    return function () {
      document.title = 'usePopcorn'
    }
  }, [title])

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
    }
    onAddWatched(newWatchedMovie)
    onCloseMovie()
  }

  return (
    <div className='details'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className='btn-back' onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={title} />
            <div className='details-overview'>
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB Rating
              </p>
            </div>
          </header>
          <section>
            <div className='rating'>
              {!isWatched ? (
                <>
                  <StarRating
                    size={24}
                    maxRating={10}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className='btn-add' onClick={handleAdd}>
                      + Add to List
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated this movie {watchedUserRating} <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  )
}
