import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  API_KEY: string = '';
  imagePathBase: string = '';

  constructor() { }

}
