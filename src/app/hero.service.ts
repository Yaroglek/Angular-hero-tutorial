import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { HeroesComponent } from './heroes/heroes.component';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ) { }

  httpOptions: {} = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private heroesUrl = 'api/heroes';

  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation: string = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(() => { this.log('fetched heroes'); }),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(() => { this.log(`fetched hero id=${id}`); }),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(() => { this.log(`updated hero id=${hero.id}`); }),
      catchError(this.handleError<any>(`updateHero`))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => { this.log(`added hero id=${newHero.id}`); }),
      catchError(this.handleError<Hero>(`addHero`))
    );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(() => { this.log(`deleted hero id=${id}`); }),
      catchError(this.handleError<Hero>(`deleteHero`))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (term.trim()) {
      const url = `${this.heroesUrl}/?name=${term}`;
      return this.http.get<Hero[]>(url).pipe(
        tap(x => { this.log(`${x.length ? 'found heroes matching' : 'no heroes matching'} "${term}"`); }),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
    } else {
      return of([]);
    }
  }
}
