import { Component, input, output } from '@angular/core';
import { Hero } from '../../hero';

@Component({
  selector: 'app-hero-additional',
  imports: [],
  templateUrl: './hero-additional.component.html',
  styleUrl: './hero-additional.component.css',
})
export class HeroAdditionalComponent {
  public data = input<Hero | null>();
  public outputData = output<string>();

  protected emitData() {
    this.outputData.emit(new Date().toLocaleDateString());
  }
}
