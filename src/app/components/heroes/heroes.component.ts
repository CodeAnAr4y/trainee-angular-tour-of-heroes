import { Component, inject } from '@angular/core';
import { Hero } from '../../hero';
import { HeroService } from '../../services/hero.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.css',
  standalone: true,
  imports: [RouterLink],
})
export class HeroesComponent {
  private heroService = inject(HeroService);
  protected heroes = this.heroService.heroes;

  protected add(name: string): void {
    name = name.trim();
    if (!name) return;
    this.heroService.addHero({ name } as Hero).subscribe();
  }

  protected delete(hero: Hero): void {
    this.heroService.deleteHero(hero.id).subscribe();
  }
}
