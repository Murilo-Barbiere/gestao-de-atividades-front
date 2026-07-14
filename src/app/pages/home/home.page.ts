import { Component } from '@angular/core';
import { ListaProjeto } from '../../components/lista-projeto/lista-projeto';
import { HomeHeader } from '../../components/home-header/home-header';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ListaProjeto, HomeHeader],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css'
})
export class HomePage {}