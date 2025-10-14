import { Component } from '@angular/core';
import { LeftMenu } from "../left-menu/left-menu";
import { Header } from "../header/header";

@Component({
  selector: 'app-dashboard',
  imports: [LeftMenu, Header],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
