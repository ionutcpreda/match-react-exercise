
const GenreFilter = ({genresFilter, buildFilter}) => {
  return (
    <div className="filter-group">
      <h5>Genres</h5>
      <div className="filters">
        {genresFilter.map((filter, i) => (
          <div className="form-check" key={`genre-filter-${i}`}>
            <input className="form-check-input" type="checkbox" value={filter.Id} id={`genre-${i}`} onChange={buildFilter}/>
            <label className="form-check-label" htmlFor={`genre-${i}`}>
              {filter.Name}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GenreFilter;