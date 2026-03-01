import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, switchMap, map } from 'rxjs';
import { Hero } from '../../hero';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.css',
})
export class HeroDetailComponent {
  hero$!: Observable<Hero | undefined>;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {
    this.hero$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      switchMap(id => this.heroService.heroes$.pipe(
        map(heroes => heroes.find(h => h.id === id))
      ))
    );
  }

  goBack() {
    this.location.back();
  }

  save(hero: Hero) {
    this.heroService.updateHero(hero).subscribe(() => this.goBack());
  }
}