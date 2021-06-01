import { FavouritesComponent } from './components/favourites/favourites.component';
import { DataService } from './components/data.service';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ConfigService } from 'src/assets/config/config.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, ObservableInput, of } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    FavouritesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    DataService,
    {
      provide: APP_INITIALIZER,
      useFactory: load,
      deps: [
        HttpClient,
        ConfigService
      ],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

function load(http: HttpClient, config: ConfigService): (() => Promise<boolean>) {
  return (): Promise<boolean> => {
    return new Promise<boolean>((resolve: (a: boolean) => void): void => {
       http.get('assets/config/config.json')
         .pipe(
            map((x: any) => {
              config.API_KEY = x.API_KEY;
              config.imagePathBase = x.imagePathBase;
              resolve(true);
            }),
            catchError((x: { status: number }, caught: Observable<void>): ObservableInput<{}> => {
              if (x.status !== 404) {
                resolve(false);
              }

              config.API_KEY = '';
              config.imagePathBase = '';

              resolve(true);
              return of({});
            })
         ).subscribe();
    });
  };
}
