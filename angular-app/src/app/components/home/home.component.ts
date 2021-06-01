import { GenreFilter } from './../models.model';
import { DataService } from './../data.service';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Movie } from '../models.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchString: string = '';
  imagePathBase: string = '';
  initialMovieList = new Array<Movie>();
  searchMovieList = new Array<Movie>();
  genresList: any = {};
  sortAsc = true;
  sortType = '';
  genresFilter = new Array<GenreFilter>();
  yearFilter = new Array<number>();

  activeGenresFilters = new Array<number>();
  activeYearFilters = new Array<number>();

  constructor(private dataService: DataService) {
    this.imagePathBase = dataService.getImagePathBase();
  }

  ngOnInit() {
    this.init();
  }

  search() {
    if(this.searchString !== '') {
      this.dataService.searchMovie(this.searchString)
      .subscribe((data: any) => {
        this.initMovieArray(data.results);
      },
      (error) => console.error(error))
    }
  }

  init() {
    forkJoin([this.dataService.getGenresList(), this.dataService.getMovieList()])
      .subscribe((results: Array<any>) => {
        results[0].genres.forEach((genre: any) => {
          this.genresList[genre.id] = genre.name;
        });

        this.initMovieArray(results[1].results);
      },
      (err) => console.error(err))
  }

  initMovieArray(arr: Array<any>) {
    this.genresFilter = new Array<any>();
    this.yearFilter = new Array<number>();

    const movieArray = arr.map(movie => {
      const existsInFavouriteStorage = localStorage.getItem(movie.id.toString());

      movie.Favourite = existsInFavouriteStorage != null ? true : false;
      movie.Cover = this.imagePathBase + movie.Poster_path;
      movie.Genres = movie.genre_ids.map((id: any) => {
        const genreName = this.genresList[id];

        if(this.genresFilter.filter(x => x.Id === id).length === 0) {
          this.genresFilter.push({
            Id: id,
            Name: genreName
          });
        }

        return genreName;
      });

      const releaseYear = new Date(movie.release_date).getFullYear();

      if(this.yearFilter.filter(x => x === releaseYear).length === 0 && !isNaN(releaseYear)) {
        this.yearFilter.push(releaseYear)
      }

      return {
        Title: movie.title,
        Cover: this.imagePathBase + movie.poster_path,
        Genre_ids: movie.genre_ids,
        Release_date: movie.release_date,
        Favourite: existsInFavouriteStorage != null ? true : false,
        Genres: movie.Genres,
        Id: movie.id,
        Poster_path: movie.poster_path
      }
    });

    this.yearFilter.sort();
    this.genresFilter.sort((a, b) => a.Name > b.Name ? 1 : -1);

    this.searchMovieList = [...movieArray]
    this.initialMovieList = [...movieArray];
  }

  buildGenreFilter(event: any) {
    if(event.target.checked === true) {
      this.activeGenresFilters.push(parseInt(event.target.value));
    }
    else if(event.target.checked === false) {
      const index = this.activeGenresFilters.findIndex(x => x === parseInt(event.target.value));

      if(index > -1) {
        this.activeGenresFilters.splice(index, 1);
      }
    }

    this.filterMovies()
  }

  buildYearFilter(event: any) {
    if(event.target.checked === true) {
      this.activeYearFilters.push(parseInt(event.target.value));
    }
    else if(event.target.checked === false) {
      const index = this.activeYearFilters.findIndex(x => x === parseInt(event.target.value));

      if(index > -1) {
        this.activeYearFilters.splice(index, 1);
      }
    }

    this.filterMovies()
  }

  filterMovies() {
    if(this.activeYearFilters.length > 0 || this.activeGenresFilters.length > 0) {
      this.searchMovieList = this.initialMovieList.filter(movie => {
        const releaseYear = new Date(movie.Release_date).getFullYear();
        let includeYear = this.activeYearFilters.length > 0 ? false : true;
        let includeGenre = this.activeGenresFilters.length > 0 ? false: true;

        this.activeYearFilters.forEach(f => {
          if (releaseYear === f) {
            includeYear = true;
          }
        })

        this.activeGenresFilters.forEach(f => {
          if (movie.Genre_ids.includes(f)) {
            includeGenre = true;
          }
        })

        return (includeGenre && includeYear);
      })
    } else {
      this.searchMovieList = this.initialMovieList.map(x => x);
    }
  }

  changeSortType(event: any) {
    this.sortType = event.target.value;
    this.sortList();
  }

  changeAscDesc() {
    this.sortAsc = !this.sortAsc;
    this.sortList();
  }

  sortList() {
    this.searchMovieList.sort((a, b) => {
      if(this.sortType === 'title' && this.sortAsc === true) {
        return a.Title > b.Title ? 1 : -1;
      }
      else if(this.sortType === 'title' && this.sortAsc === false) {
        return a.Title < b.Title ? 1 : -1;
      }
      else if(this.sortType === 'year' && this.sortAsc === true) {
        return a.Release_date > b.Release_date ? 1 : -1;
      }
      else if(this.sortType === 'year' && this.sortAsc === false) {
        return a.Release_date < b.Release_date ? 1 : -1;
      }

      return 0;
    })
  }

  toggleMovieFavourite(addToFavourite: boolean, movieIndex: any) {
    this.searchMovieList[movieIndex].Favourite = addToFavourite;

    const movieId = this.searchMovieList[movieIndex].Id.toString();

    let localStorageMovie = localStorage.getItem(movieId);

    if (localStorageMovie == null && addToFavourite) {
      localStorage.setItem(movieId, JSON.stringify(this.searchMovieList[movieIndex]));
    }
    else if(localStorageMovie != null && !addToFavourite) {
      localStorage.removeItem(movieId);
    }
  }


}
