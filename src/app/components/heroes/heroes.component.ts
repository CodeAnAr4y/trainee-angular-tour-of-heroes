import { Component, effect, inject, signal, untracked } from '@angular/core';
import { Hero } from '../../hero';
import { HeroService } from '../../services/hero.service';
import { RouterLink } from '@angular/router';
import { HeroAdditionalComponent } from '../hero-additional/hero-additional.component';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.css',
  standalone: true,
  imports: [RouterLink, HeroAdditionalComponent],
})
export class HeroesComponent {
  private heroService = inject(HeroService);
  private messageService = inject(MessageService);
  protected heroes = this.heroService.heroes;

  protected selectedHero: Hero | null = null;

  emittedData = signal<string>('');

  constructor() {
    effect(() => {
      // Shows this efect only if heroes array changes
      const heroesLength = this.heroes().length;
      const messagesCount = untracked(() =>
        this.messageService.messageCounter()
      );
      console.log(
        `Now count of heroes is: ${heroesLength}, last message id is: ${messagesCount}`
      );
    });
  }

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
