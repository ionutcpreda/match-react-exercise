import './../Home/Home.css'
import { useEffect, useState } from 'react';

const Favourites = () => {
  const [favouriteList, setfavouriteList] = useState([])

  useEffect(() => {
    const localStorageKeys = Object.keys(localStorage);
    let favouritesArr = [];

    localStorageKeys.forEach(key => {
      const movie = JSON.parse(localStorage.getItem(key));

      if(movie != null && movie.Id != null){
        favouritesArr.push(movie)
      }
    })

    setfavouriteList(favouritesArr);
  }, [])

  const removeFromFavourite = (movieId, movieIndex) => {
    let favourites = [...favouriteList];
    favourites.splice(movieIndex, 1);

    setfavouriteList(favourites);

    localStorage.removeItem(movieId.toString());
  }

  return (
    <div className="container">
      <div className="row mt-2">
        {favouriteList.map((movie, i) => (
          <div className="col-3 mb-3" key={`favourite-movie-${i}`}>
            <div className="movie-card">
              <img src={movie.Cover} alt=""/>
              <button type="button" className="btn btn-danger btn-sm btn-block favourite-btn" onClick={() => removeFromFavourite(movie.Id, i)}>Remove from favourites</button>

              <div className="movie-details">
                {movie.Genres.map((genre, genreId) => (
                  <div className="movie-genre" key={`movie-${i}-genre-${genreId}`}>{genre}</div>
                ))}                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


export default Favourites;