import { Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location, AsyncPipe, UpperCasePipe } from '@angular/common';
import { Observable, switchMap, map } from 'rxjs';
import { Hero } from '../../hero';
import { HeroService } from '../../services/hero.service';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.css',
  standalone: true,
  imports: [FormsModule, AsyncPipe, UpperCasePipe],
})
export class HeroDetailComponent {
  private route = inject(ActivatedRoute);
  private heroService = inject(HeroService);
  private location = inject(Location);

  private idParam: Signal<number> = toSignal(
    this.route.paramMap.pipe(map(p => Number(p.get('id')))), 
    { initialValue: 0 }
  );

  protected hero = computed(() => 
    this.heroService.heroes().find(h => h.id === this.idParam())
  );

  protected goBack() {
    this.location.back();
  }

  protected save(hero: Hero) {
    this.heroService.updateHero(hero).subscribe(() => this.goBack());
  }
}