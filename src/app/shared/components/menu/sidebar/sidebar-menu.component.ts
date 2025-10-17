import { Component, signal } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { MenuItem } from "../menu-item/menu-item";

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
  imports: [MenuItem]
})
export class SidebarMenuComponent {
  isExpanded = false;


  constructor(){
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
}
