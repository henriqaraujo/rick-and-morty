import { Component, signal } from '@angular/core';
import { Header } from './header/header';
import { LeftMenu } from './left-menu/left-menu';
import { Dashboard } from "./dashboard/dashboard";
import { EpisodesComponent } from "./episodes/episodes";
import { Characters } from './characters/characters';
import { CharacterDetail } from './character-detail/character-detail';
import { EpisodeDetailsComponent } from './episode-details/episode-details';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Dashboard,
    Header,
    LeftMenu,
    EpisodesComponent,

],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('rick-and-morty');
}
