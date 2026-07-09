import { Component } from '@angular/core';
import { ListaProjeto } from '../../components/lista-projeto/lista-projeto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ListaProjeto],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComposenet {}