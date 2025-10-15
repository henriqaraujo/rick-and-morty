import { Component } from '@angular/core';
import { LeftMenu } from "../pages/left-menu/left-menu";
import { Header } from "../pages/header/header";

@Component({
  selector: 'app-dashboard',
  imports: [LeftMenu, Header],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
