import { Component, OnInit } from '@angular/core';
import { Movie } from '../models.model';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {
  favouritesList = new Array<Movie>();

  constructor() { }

  ngOnInit() {
    const localStorageKeys = Object.keys(localStorage);

    localStorageKeys.forEach(key => {
      const movie = localStorage.getItem(key);

      if(movie != null){
        this.favouritesList.push(JSON.parse(movie))
      }
    })
  }

  removeFromFavourite(movieId: number, movieIndex: number) {
    this.favouritesList.splice(movieIndex, 1);
    localStorage.removeItem(movieId.toString());
  }
}
