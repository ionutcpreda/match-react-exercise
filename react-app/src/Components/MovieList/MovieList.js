import MovieCard from './../MovieCard/MovieCard';

const MovieList = ({movieList}) => {
  return (
    <>
      {movieList.map((movie, i) => (
        <MovieCard 
          key={`movie-${movie.Id}`} 
          index={i}
          Movie={movie}/>
      ))}
    </>
  )
}

export default MovieList;