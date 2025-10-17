import { Component, signal } from '@angular/core';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarMenuComponent } from './shared/components/menu/sidebar/sidebar-menu.component';
import { RouterOutlet } from '@angular/router';
import { NavigationHistoryService } from './services/navigation-history.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarMenuComponent,
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
