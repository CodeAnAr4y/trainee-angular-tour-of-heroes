import { Component } from '@angular/core';
import { Hero } from '../../hero';
import { HEROES } from '../../mock-heroes';
import { CommonModule, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [NgFor, FormsModule, UpperCasePipe, HeroDetailComponent],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.css',
})
export class HeroesComponent {
  hero: Hero = {
    id: 1,
    name: 'Windstorm',
  };

  selectedHero?: Hero;

  heroes: Hero[] = HEROES;

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }
}
