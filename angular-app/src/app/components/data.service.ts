import { ConfigService } from './../../assets/config/config.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  private API_KEY: string;
  private imagePathBase: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.API_KEY = configService.API_KEY;
    this.imagePathBase = configService.imagePathBase;
   }

  getMovieList() {
    return this.http.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${this.API_KEY}&language=en-US&page=4&region=US`)
  }

  searchMovie(title: string) {
    return this.http.get(`https://api.themoviedb.org/3/search/movie?api_key=${this.API_KEY}&language=en-US&query=${title}&page=1&include_adult=false`)
  }

  getGenresList() {
    return this.http.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.API_KEY}&language=en-US`)
  }

  getImagePathBase() {
    return this.imagePathBase;
  }

}
