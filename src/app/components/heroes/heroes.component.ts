import { Component, inject, signal } from '@angular/core';
import { Hero } from '../../hero';
import { HeroService } from '../../services/hero.service';
import { RouterLink } from '@angular/router';
import { HeroAdditionalComponent } from '../hero-additional/hero-additional.component';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.css',
  standalone: true,
  imports: [RouterLink, HeroAdditionalComponent],
})
export class HeroesComponent {
  private heroService = inject(HeroService);
  protected heroes = this.heroService.heroes;

  protected selectedHero: Hero | null = null;

  emittedData = signal<string>('');

  protected add(name: string): void {
    name = name.trim();
    if (!name) return;
    this.heroService.addHero({ name } as Hero).subscribe();
  }

  protected delete(hero: Hero): void {
    this.heroService.deleteHero(hero.id).subscribe();
  }

  protected sendToChild(hero: Hero) {
    this.selectedHero === hero
      ? (this.selectedHero = null)
      : (this.selectedHero = hero);
  }
}
