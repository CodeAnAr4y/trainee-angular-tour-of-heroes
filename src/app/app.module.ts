import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeroesComponent } from './components/heroes/heroes.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { HeroDetailComponent } from './components/hero-detail/hero-detail.component';
import { MessagesComponent } from './components/messages/messages.component';

@NgModule({
  declarations: [AppComponent, MessagesComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HeroesComponent,
    HeroDetailComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
