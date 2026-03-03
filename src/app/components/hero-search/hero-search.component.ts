import { Component } from '@angular/core';
import { HeroService } from '../../services/hero.service';
import { NgFor, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrl: './hero-search.component.css',
  standalone: true,
  imports: [NgFor, RouterLink, AsyncPipe],
})
export class HeroSearchComponent {
  heroes$ = this.heroService.searchResults$;

  constructor(private heroService: HeroService) {}

  search(term: string) {
    this.heroService.search(term);
  }
}
