import { Component, signal } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { MenuItem } from "../menu-item/menu-item";

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.html',
  styleUrls: ['./sidebar-menu.scss'],
  imports: [MenuItem]
})
export class SidebarMenu {
  isExpanded = false;


  constructor(){
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
}
