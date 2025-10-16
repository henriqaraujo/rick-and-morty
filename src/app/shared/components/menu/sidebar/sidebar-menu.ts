import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from "../menu-item/menu-item";

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.html',
  styleUrls: ['./sidebar-menu.scss'],
  imports: [RouterLink, MenuItem]
})
export class SidebarMenu {
  isExpanded = false;

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
}
