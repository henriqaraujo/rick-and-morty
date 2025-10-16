import { Component, signal } from '@angular/core';
import { Header } from './pages/header/header';
import { SidebarMenu } from './shared/components/menu/sidebar/sidebar-menu';
import { RouterOutlet } from '@angular/router';
import { NavigationHistoryService } from './services/navigation-history.service';

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

  constructor(private navigationHistory: NavigationHistoryService) {

  }

}
