import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  imports: [],
  templateUrl: './menu-item.html',
  styleUrl: './menu-item.scss'
})
export class MenuItem {
  @Input() isExpanded: boolean = false;
  @Input() label: string = '';
  @Input() icon: string = '';
}
