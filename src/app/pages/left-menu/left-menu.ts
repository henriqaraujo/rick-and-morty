import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.html',
  styleUrls: ['./left-menu.scss'],
  imports: [RouterLink]
})
export class LeftMenu {
  isExpanded = false;

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
}
