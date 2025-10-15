import { Component, signal } from '@angular/core';
import { Header } from './pages/header/header';
import { LeftMenu } from './pages/left-menu/left-menu';
import { Dashboard } from "./pages/dashboard/dashboard";
import { EpisodesComponent } from "./pages/episodes/episodes";
import { Characters } from './pages/characters/characters';
import { CharacterDetail } from './pages/character-detail/character-detail';
import { EpisodeDetailsComponent } from './pages/episode-details/episode-details';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Dashboard,
    Header,
    LeftMenu,
    EpisodesComponent,
    EpisodeDetailsComponent

],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('rick-and-morty');

  
}
