import { Component } from '@angular/core';
import { HeroService } from '../../services/hero.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrl: './hero-search.component.css',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
})
export class HeroSearchComponent {
  protected heroes$ = this.heroService.searchResults$;

  constructor(private heroService: HeroService) {}

  protected search(term: string) {
    this.heroService.search(term);
  }
}
