
const YearFilter = ({yearFilter, buildFilter}) => {
  return (
    <div className="filter-group mt-3">
      <h5>Years of release</h5>
      <div className="filters">
        {yearFilter.map((filter, i) => (
          <div className="form-check" key={`year-filter-${i}`}>
            <input className="form-check-input" type="checkbox" value={filter} id={`year-${i}`} onChange={buildFilter}/>
            <label className="form-check-label" htmlFor={`year-${i}`}>
              {filter}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default YearFilter;