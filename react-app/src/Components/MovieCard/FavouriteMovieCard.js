import { useState } from "react";


const FavouriteMovieCard = ({Movie, changeList}) => {
  const [movie] = useState(Movie);

  const removeFromFavourite = (movieId) => {
    // let favourites = [...favouriteList];
    // favourites.splice(movieIndex, 1);

    // setfavouriteList(favourites);

    localStorage.removeItem(movieId.toString());

    changeList(movieId);
  }

  return (
    <div className="movie-card">
      <img src={movie.Cover} alt=""/>
      <button type="button" className="btn btn-danger btn-sm btn-block favourite-btn" onClick={() => removeFromFavourite(movie.Id)}>Remove from favourites</button>

      <div className="movie-details">
        {movie.Genres.map((genre, genreId) => (
          <div className="movie-genre" key={`movie-${movie.Id}-genre-${genreId}`}>{genre}</div>
        ))}                
      </div>
    </div>
  )
}

export default FavouriteMovieCard;