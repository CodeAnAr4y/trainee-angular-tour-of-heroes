import { Component } from '@angular/core';
import { HeroService } from '../../services/hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrl: './hero-search.component.css',
})
export class HeroSearchComponent {
  heroes$ = this.heroService.searchResults$;

  constructor(private heroService: HeroService) {}

  search(term: string) {
    this.heroService.search(term);
  }
}