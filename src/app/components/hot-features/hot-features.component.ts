import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  of,
  merge,
  concat,
  race,
  forkJoin,
  zip,
  combineLatest,
  Subject,
} from 'rxjs';
import {
  map,
  tap,
  switchMap,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  catchError,
  retry,
  finalize,
  share,
  shareReplay,
  delay,
  takeUntil,
} from 'rxjs/operators';
import { HeroService } from '../../services/hero.service';
import { Hero } from '../../hero';

@Component({
  selector: 'app-hot-features',
  templateUrl: './hot-features.component.html',
  styleUrl: './hot-features.component.css',
})
export class HotFeaturesComponent implements OnInit, OnDestroy {
  heroes$ = this.heroService.heroes$.pipe(
    finalize(() => console.log('stream completed'))
  );
  private destroy$ = new Subject<void>();

  filteredHeroes$ = this.heroes$;

  input$ = new Subject<string>();

  textToDisplay$ = this.input$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    tap((val) => console.log(val))
  );

  constructor(private heroService: HeroService) {}

  searchHero(id: number) {
    return this.heroes$.pipe(
      map((heroes) => heroes.filter((hero) => hero.id == id))
    );
  }

  ngOnInit(): void {
    // map, filter, tap
    const uppercasedHeroes$ = this.heroes$.pipe(
      map((heroes) => heroes.map((h) => ({ ...h, name: h.name.toUpperCase() })))
    );

    uppercasedHeroes$
      .pipe(takeUntil(this.destroy$))
      .subscribe((heroes) => console.log('UPPERCASED:', heroes));

    const filteredHeroes$ = this.heroes$.pipe(
      map((heroes) => heroes.filter((h) => h.id < 20)),
      map((heroes) => heroes.slice(0, 5))
    );

    filteredHeroes$
      .pipe(
        tap((heroes) => console.log('FILTERED:', heroes)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    // switchMap, mergeMap, concatMap, exhaustMap.

    of(12, 13, 14, 15, 16)
      .pipe(
        concatMap((id) => of(id).pipe(delay(1000))),
        switchMap((id) => this.searchHero(id)),
        tap((heroes) => console.log('Hero:', heroes)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    // retries and catchError
    of(12, 13, 15)
      .pipe(
        switchMap((id) =>
          this.searchHero(id).pipe(
            catchError((err) => {
              console.error('error occured', err);
              return of([]);
            })
          )
        ),
        retry(2),
        tap((heroes) => console.log('with retry', heroes)),
        takeUntil(this.destroy$)
      )
      .subscribe();

    // combineLatest
    const color$ = new Subject<string>();
    const size$ = new Subject<number>();

    combineLatest([color$, size$])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: [string, number]) =>
        console.log('result of combined', result)
      );

    // forkJoin
    forkJoin([color$, size$])
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => console.log('forkJoin', res)); // waiting for finish of each array items

    color$.next('red');
    console.log('nothing chaged');
    size$.next(42);
    console.log('combineLatest finished');

    [color$, size$].forEach((item) => item.complete());

    zip(of(1, 2, 3), of('a', 'b', 'c')).subscribe(console.log);

    const shape$ = new Subject<string>();
    const area$ = new Subject<number>();

    const merged = merge(shape$, area$);
    merged
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => console.log('merged', val));

    concat(shape$, area$).subscribe((val) => console.log('concat', val));

    race(shape$, area$).subscribe((res) =>
      console.log('race finished, first is:', res)
    );

    shape$.next('square');
    setTimeout(() => {
      area$.next(24);
      area$.complete();
    }, 1000);

    shape$.complete();

    // share, shareReplay
    this.heroService.heroes$
      .pipe(
        tap(() => console.log('Original stream')),
        share()
      )
      .subscribe();

    this.heroService.heroes$
      .pipe(
        tap(() => console.log('Shared replay stream')),
        shareReplay(1)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
