import { Component, signal } from '@angular/core';
import { Header } from './pages/header/header';
import { SidebarMenu } from './shared/components/menu/sidebar/sidebar-menu';
import { Home } from "./pages/home/home";
import { EpisodesComponent } from "./pages/episodes/list/episodes";
import { CharacterList } from './pages/characters/list/character-list';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Header,
    SidebarMenu,
    RouterOutlet
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('rick-and-morty');


}
