import { Component, OnInit } from '@angular/core';
import { HeroService } from '../../services/hero.service';
import { Hero } from '../../hero';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  heroes$ = this.heroService.heroes$.pipe(map((heroes) => heroes.slice(0, 4)));

  constructor(private heroService: HeroService) {}
}
