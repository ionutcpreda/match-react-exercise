import {useState, useEffect} from 'react'
import './Home.css';
import configData from './../../config.json'

const Home = () => {
  const [searchString, setSearchString] = useState('');
  const [searchMovieList, setSearchMovieList] = useState([]);
  const [initialMovieList, setInitialMovieList] = useState([]);
  const [genresList, setGenresList] = useState({});

  const [genresFilter, setGenresFilter] = useState([]);
  const [yearFilter, setYearFilter] = useState([]);

  const [activeGenresFilters, setActiveGenresFilters] = useState([]);
  const [activeYearFilters, setActiveYearFilters] = useState([]);

  const [sortType, setSortType] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  
  const API_KEY = configData.API_KEY;
  const imagePathBase = configData.imagePathBase;
 
  const init = () => {
    const genresPromise = fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`)
    const movieListPromise = fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=4&region=US`)

    Promise.all([genresPromise, movieListPromise])
      .then(res => Promise.all(res.map(promise => promise.json())))
      .then(res => {
        let list = {};

        res[0].genres.forEach(genre => {
          list[genre.id] = genre.name;
        })
        
        initMovieArray(res[1].results, list);
        setGenresList(list);
      })
      .catch(err => console.error(err));    
  }
  
  useEffect(() => {
    init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const changeSearchString = (e) => {
    setSearchString(e.target.value);
  }

  const search = () => {
    if(searchString !== '') {
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${searchString}&page=1&include_adult=false`)
        .then(res => res.json())
        .then(res => {
          initMovieArray(res.results);
        })
        .catch(err => console.error(err));
    }
  }

  const initMovieArray = (arr, genreList = genresList) => {
    setGenresFilter([]);
    setYearFilter([]);

    let genresFilterArr = [];
    let yearFilterArr = [];

    const movieArray = arr.map(movie => {
      const existsInFavouriteStorage = localStorage.getItem(movie.id.toString());

      movie.Favourite = existsInFavouriteStorage != null ? true : false;
      movie.Genres = movie.genre_ids.map(id => {
        const genreName = genreList[id];

        if(genresFilterArr.filter(x => x.Id === id).length === 0) {
          genresFilterArr.push({
            Id: id,
            Name: genreName
          });
        }

        return genreName;
      });
      
      const releaseYear = new Date(movie.release_date).getFullYear();

      if(yearFilterArr.filter(x => x === releaseYear).length === 0 && !isNaN(releaseYear)) {
        yearFilterArr.push(releaseYear)
      }

      return {            
        Title: movie.title,
        Cover: imagePathBase + movie.poster_path,
        Genre_ids: movie.genre_ids,
        Release_date: movie.release_date,
        Favourite: existsInFavouriteStorage != null ? true : false,
        Genres: movie.Genres,
        Id: movie.id,
        Poster_path: movie.poster_path            
      }
    });

    yearFilterArr.sort();
    genresFilterArr.sort((a, b) => a.Name > b.Name ? 1 : -1);

    setGenresFilter(genresFilterArr);
    setYearFilter(yearFilterArr);

    setSearchMovieList(movieArray);
    setInitialMovieList(movieArray);
  }

  const toggleMovieFavourite = (addToFavourite, movieIndex) => {
    let changedArray = [...searchMovieList]; 
    changedArray[movieIndex].Favourite = addToFavourite;

    setSearchMovieList(changedArray);

    const movieId = searchMovieList[movieIndex].Id.toString();

    const localStorageMovie = localStorage.getItem(movieId);

    if (localStorageMovie == null && addToFavourite) {
      localStorage.setItem(movieId, JSON.stringify(searchMovieList[movieIndex]));
    }
    else if(localStorageMovie != null && !addToFavourite) {
      localStorage.removeItem(movieId);
    }
  }

  const sortList = (sortTypeValue = sortType, sortAscValue = sortAsc) => {
    const sortedArray = [...searchMovieList].sort((a, b) => {
      if(sortTypeValue === 'title' && sortAscValue === true) {
        return a.Title > b.Title ? 1 : -1;
      }
      else if(sortTypeValue === 'title' && sortAscValue === false) {
        return a.Title < b.Title ? 1 : -1;
      }
      else if(sortTypeValue === 'year' && sortAscValue === true) {
        return a.Release_date > b.Release_date ? 1 : -1;
      }
      else if(sortTypeValue === 'year' && sortAscValue === false) {
        return a.Release_date < b.Release_date ? 1 : -1;
      }

      return 0;
    })

    setSortType(sortTypeValue);
    setSearchMovieList(sortedArray);
  }

  const changeAscDesc = () => {
    sortList(sortType, !sortAsc);
    setSortAsc(!sortAsc)
  }

  const filterMovies = (yearFilters = activeYearFilters, genreFilters = activeGenresFilters) => {
    if(yearFilters.length > 0 || genreFilters.length > 0) {
      setSearchMovieList(initialMovieList.filter(movie => {
        const releaseYear = new Date(movie.Release_date).getFullYear();
        let includeYear = yearFilters.length > 0 ? false : true;
        let includeGenre = genreFilters.length > 0 ? false: true;

        yearFilters.forEach(f => {
          if (releaseYear === f) {
            includeYear = true;
          }
        })

        genreFilters.forEach(f => {
          if (movie.Genre_ids.includes(f)) {
            includeGenre = true;
          }
        })

        return (includeGenre && includeYear);
      }))
    } else {
      setSearchMovieList(initialMovieList);
    }
  }

  const buildGenreFilter = (e) => {
    let filters = [...activeGenresFilters];

    if(e.target.checked === true) {
      filters.push(parseInt(e.target.value));
      setActiveGenresFilters(filters);
    }
    else if(e.target.checked === false) {
      const index = filters.findIndex(x => x === parseInt(e.target.value));

      if(index > -1) {
        filters.splice(index, 1);
        setActiveGenresFilters(filters);
      }
    }

    filterMovies(activeYearFilters, filters);
  }

  const buildYearFilter = (e) => {
    let filters = [...activeYearFilters];

    if(e.target.checked === true) {
      filters.push(parseInt(e.target.value));
      setActiveYearFilters(filters);
    }
    else if(e.target.checked === false) {
      const index = filters.findIndex(x => x === parseInt(e.target.value));

      if(index > -1) {
        filters.splice(index, 1);
        setActiveYearFilters(filters);
      }
    }

    filterMovies(filters, activeGenresFilters);
  }

  return (
    <div className="container">
      <div className="row mt-2">
        <div className="col-3">
          <input className="form-control" type="text" name="search" id="movie-search"
            onChange={changeSearchString}
            onKeyUp={(e) => e.key === 'Enter' && search()}
            placeholder="Search for movie titles" />
        </div>
        <div className="col-2">
          <button className="btn btn-info" onClick={() => search()}>SEARCH</button>
        </div>
        <div className="col-auto ml-auto p-0">
          <i className={"fa sort-icon " + (sortAsc === true ? 'fa-arrow-down' : 'fa-arrow-up')} aria-hidden="true" onClick={changeAscDesc}></i>
        </div>
        <div className="col-auto">
          <select className="form-control" id="sort" onChange={(e) => sortList(e.target.value)}>
            <option value="">Sort</option>
            <option value="title">Sort by Title</option>
            <option value="year">Sort by Year of Release</option>
          </select>
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-3">
          <div className="filter-group">
            <h5>Genres</h5>
            <div className="filters">
              {genresFilter.map((filter, i) => (
                <div className="form-check" key={`genre-filter-${i}`}>
                  <input className="form-check-input" type="checkbox" value={filter.Id} id={`genre-${i}`} onChange={buildGenreFilter}/>
                  <label className="form-check-label" htmlFor={`genre-${i}`}>
                    {filter.Name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="filter-group mt-3">
            <h5>Years of release</h5>
            <div className="filters">
              {yearFilter.map((filter, i) => (
                <div className="form-check" key={`year-filter-${i}`}>
                  <input className="form-check-input" type="checkbox" value={filter} id={`year-${i}`} onChange={buildYearFilter}/>
                  <label className="form-check-label" htmlFor={`year-${i}`}>
                    {filter}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-9">
          <div className="row">
            {searchMovieList.map((movie, i) => (
              <div className="col-3 mb-3" key={`movie-${i}`}>
                <div className="movie-card">
                  <img src={movie.Cover} alt=""/>      
                  { movie.Favourite ? 
                    (<button type="button" className="btn btn-danger btn-sm btn-block favourite-btn" onClick={() => toggleMovieFavourite(false, i)}>Remove from favourites</button>) : 
                    (<button type="button" className="btn btn-outline-danger btn-sm btn-block favourite-btn" onClick={() => toggleMovieFavourite(true, i)}>Add to favourites</button>)
                  }
                  
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

      </div>
    </div>



  )
}


export default Home;