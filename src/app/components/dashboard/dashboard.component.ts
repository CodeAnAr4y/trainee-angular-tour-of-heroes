import { Component, computed, inject, OnInit } from '@angular/core';
import { HeroService } from '../../services/hero.service';
import { RouterLink } from '@angular/router';
import { HeroSearchComponent } from '../hero-search/hero-search.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  imports: [RouterLink, HeroSearchComponent],
})
export class DashboardComponent {
  private heroService = inject(HeroService);
  protected heroes = computed(() => this.heroService.heroes().slice(0, 4));
}
