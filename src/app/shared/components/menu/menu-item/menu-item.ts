import { Component, Input } from '@angular/core';
import { AppRoutingModule } from "../../../../app.routes";

@Component({
  selector: 'app-menu-item',
  imports: [AppRoutingModule],
  templateUrl: './menu-item.html',
  styleUrl: './menu-item.scss'
})
export class MenuItem {
  @Input() isExpanded: boolean = false;
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() url: string = '';
}
