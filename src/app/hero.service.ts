import { Injectable } from '@angular/core';
import { Observable, of }from 'rxjs';
import { catchError, tap, map}from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Hero } from './hero';
import { MessageService } from './message.service';

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

@Injectable({
  providedIn: 'root',
})
export class HeroService {

  private heroesURL = 'api/heroes';
  
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }
  
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesURL)
      .pipe(
        tap(_ => this.log('Fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );
  }
  
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesURL}/${id}`;    
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`Heroe with id=${id} fetched`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }
  
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesURL, hero, httpOptions)
      .pipe(
          tap((newHero: Hero) => this.log(`Added heroe with id=${newHero.id}`)),
          catchError(this.handleError<Hero>(`addHero`))
        );
  }
  
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesURL, hero, httpOptions)
      .pipe(
          tap(_ => this.log(`Updated heroe with id=${hero.id}`)),
          catchError(this.handleError<any>(`updateHero`))
        );
  }
  
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesURL}/${id}`;
    return this.http.delete<Hero>(url, httpOptions)
      .pipe(
            tap(_ => this.log(`Deleted heroe with id=${id}`)),
            catchError(this.handleError<Hero>(`deleteHero`))
          );
  }
  
  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()){
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesURL}/?name=${term}`)
      .pipe(
            tap(_ => this.log(`Found heroes matching ${term}`)),
            catchError(this.handleError<Hero[]>(`searchHeroes`, []))
          );
  }
  
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
  
   /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
