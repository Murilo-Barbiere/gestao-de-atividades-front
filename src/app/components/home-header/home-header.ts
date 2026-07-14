import { Component } from '@angular/core';
import { UserButton } from "../user-button/user-button";

@Component({
  selector: 'app-home-header',
  imports: [UserButton],
  templateUrl: './home-header.html',
  styleUrl: './home-header.css',
})
export class HomeHeader {}
