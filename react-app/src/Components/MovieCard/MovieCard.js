import { useState } from "react";


const MovieCard = ({Movie}) => {
  const [movie, setMovie] = useState(Movie);

  const toggleMovieFavourite = (addToFavourite) => {
    const movieChanged = {...movie, Favourite: addToFavourite};

    setMovie(movieChanged);

    const localStorageMovie = localStorage.getItem(movie.Id);

    if (localStorageMovie == null && addToFavourite) {
      localStorage.setItem(movie.Id, JSON.stringify(movie));
    } else if(localStorageMovie != null && !addToFavourite) {
      localStorage.removeItem(movie.Id);
    }
  }

  return (
    <div className="col-3 mb-3">
      <div className="movie-card">
        <img src={movie.Cover} alt=""/>      
        { movie.Favourite ? 
          (<button type="button" className="btn btn-danger btn-sm btn-block favourite-btn" onClick={() => toggleMovieFavourite(false)}>Remove from favourites</button>) : 
          (<button type="button" className="btn btn-outline-danger btn-sm btn-block favourite-btn" onClick={() => toggleMovieFavourite(true)}>Add to favourites</button>)
        }        
        <div className="movie-details">
          {movie.Genres.map((genre, genreId) => (
            <div className="movie-genre" key={`movie-${movie.Id}-genre-${genreId}`}>{genre}</div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default MovieCard;