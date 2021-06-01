export interface Movie {
  Title: string;
  Release_date: string;
  Favourite: boolean;
  Id: number;
  Genre_ids: Array<number>;
  Genres: Array<string>;
  Poster_path: string;
  Cover: string;
}

export interface GenreFilter {
  Id: number;
  Name: string;
}
