import { effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Hero } from '../hero';
import { MessageService } from './message.service';
import { HEROES } from '../mock-heroes';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = 'api/heroes';
  private messageService = inject(MessageService);

  private _heroes = signal<Hero[]>([]);
  public heroes = this._heroes.asReadonly();

  private heroesSubject = new BehaviorSubject<Hero[]>(HEROES);
  public heroes$ = this.heroesSubject.asObservable(); // Only for hot features component needed !

  private STORAGE_KEY = 'heroes';

  private searchTerms = new BehaviorSubject<string>('');

  public readonly searchResults$ = this.searchTerms.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap((term) =>
      term !== '' ? this.messageService.add(`searching "${term}"`) : term
    ),
    switchMap((term) => this.searchHeroesRequest(term))
  );

  constructor(private http: HttpClient) {
    this.loadHeroes();
    effect(() => {
      window.localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this._heroes())
      );
      this.messageService.add('Heroes updated on LocalStorage');
    });
  }

  private loadHeroes(): void {
    const cached = window.localStorage.getItem(this.STORAGE_KEY);
    if (cached) {
      this._heroes.set(JSON.parse(cached));
      return;
    }
    this.http
      .get<Hero[]>(this.heroesUrl)
      .pipe(catchError(() => of([])))
      .subscribe((heroes) => {
        if (heroes.length > 0) {
          this._heroes.set(heroes);
        }
      });
  }

  public addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero).pipe(
      tap((newHero) => {
        this._heroes.update((heroes) => [...heroes, newHero]);
        this.messageService.add(
          `Hero added id: ${newHero.id}, name: ${newHero.name}`
        );
      }),
      catchError(() => {
        this.messageService.add('Failed to add Hero');
        return of(hero);
      })
    );
  }

  public deleteHero(id: number): Observable<void> {
    return this.http.delete<void>(`${this.heroesUrl}/${id}`).pipe(
      tap(() => {
        this._heroes.update((heroes) => heroes.filter((h) => h.id !== id));
        this.messageService.add(`Hero id: ${id} deleted`);
      }),
      catchError((err) => {
        this.messageService.add(`delete hero id: ${id} failed`);
        return throwError(() => err);
      })
    );
  }

  public updateHero(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(`${this.heroesUrl}/${hero.id}`, hero).pipe(
      tap((updated) => {
        this._heroes.update((heroes) =>
          heroes.map((h) => (h.id === hero.id ? hero : h))
        );
        this.messageService.add(`hero id: ${updated.id} successfully updated`);
      }),
      catchError(() => {
        this.messageService.add(`failed to update hero ${hero.id}`);
        return of(hero);
      })
    );
  }

  public search(term: string): void {
    this.searchTerms.next(term);
  }

  private searchHeroesRequest(term: string): Observable<Hero[]> {
    if (!term.trim()) return of([]);

    return this.http
      .get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
      .pipe(catchError(() => of([])));
  }
}
