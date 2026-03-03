import { Component } from '@angular/core';
import { Hero } from '../../hero';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.css',
})
export class HeroesComponent {
  heroes$ = this.heroService.heroes$;

  constructor(private heroService: HeroService) {
    this.heroes$.subscribe((res) => console.log(res));
  }

  add(name: string): void {
    name = name.trim();
    if (!name) return;

    this.heroService.addHero({ name } as Hero).subscribe();
  }

  delete(hero: Hero): void {
    this.heroService.deleteHero(hero.id).subscribe();
  }
}
