import { useState } from "react";

const Search = ({apiKey, initArray}) => {  
  const [searchString, setSearchString] = useState('');

  const changeSearchString = (e) => {
    setSearchString(e.target.value);
  }

  const search = () => {
    if(searchString !== '') {
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${searchString}&page=1&include_adult=false`)
        .then(res => res.json())
        .then(res => {
          initArray([...res.results]);
        })
        .catch(err => console.error(err));
    }
  }

  return (
    <>
      <div className="col-3">
        <input className="form-control" type="text" name="search" id="movie-search"
          onChange={changeSearchString}
          onKeyUp={(e) => e.key === 'Enter' && search()}
          placeholder="Search for movie titles" />
      </div>
      <div className="col-2">
        <button className="btn btn-info" onClick={() => search()}>SEARCH</button>
      </div>
    </>
  )
}

export default Search;