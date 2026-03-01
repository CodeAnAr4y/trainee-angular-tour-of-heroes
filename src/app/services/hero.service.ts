import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Hero } from '../hero';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = 'api/heroes';

  private heroesSubject = new BehaviorSubject<Hero[]>([]);
  heroes$ = this.heroesSubject.asObservable();

  private searchTerms = new BehaviorSubject<string>('');

  searchResults$ = this.searchTerms.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((term) => this.searchHeroesRequest(term))
  );

  constructor(private http: HttpClient) {
    this.loadHeroes();
  }

  private loadHeroes(): void {
    this.http
      .get<Hero[]>(this.heroesUrl)
      .pipe(catchError(() => of([])))
      .subscribe((heroes) => this.heroesSubject.next(heroes));
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero).pipe(
      tap((newHero) => {
        const current = this.heroesSubject.value;
        this.heroesSubject.next([...current, newHero]);
      }),
      catchError(() => of(hero))
    );
  }

  deleteHero(id: number): Observable<void> {
    return this.http.delete<void>(`${this.heroesUrl}/${id}`).pipe(
      tap(() => {
        const current = this.heroesSubject.value;
        this.heroesSubject.next(current.filter((h) => h.id !== id));
      }),
      catchError(() => of(undefined))
    );
  }

  updateHero(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(`${this.heroesUrl}/${hero.id}`, hero).pipe(
      tap((updated) => {
        const current = this.heroesSubject.value;
        this.heroesSubject.next(
          current.map((h) => (h.id === updated.id ? updated : h))
        );
      }),
      catchError(() => of(hero))
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  private searchHeroesRequest(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }

    return this.http
      .get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
      .pipe(catchError(() => of([])));
  }
}
