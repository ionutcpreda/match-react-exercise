import './../Home/Home.css'
import { useEffect, useState } from 'react';
import FavouriteMovieCard from '../MovieCard/FavouriteMovieCard';

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

  const changeFavouriteList = (id) => {
    let favourites = [...favouriteList];
    const index = favourites.findIndex(x => x.Id === id);

    if(index > -1) {
      favourites.splice(index, 1);
  
      setfavouriteList(favourites);
    }
  }

  return (
    <div className="container">
      <div className="row mt-2">
        {favouriteList.map((movie) => (
          <div className="col-3 mb-3" key={`favourite-movie-${movie.Id}`}>
            <FavouriteMovieCard Movie={movie} changeList={changeFavouriteList}/>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Favourites;