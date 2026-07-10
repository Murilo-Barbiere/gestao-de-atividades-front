import { Component, input } from '@angular/core';
import { Projeto } from '../../core/interface/projeto';

@Component({
  selector: 'app-projeto-card',
  imports: [],
  templateUrl: './projeto-card.component.html',
  styleUrl: './projeto-card.component.css',
  standalone: true
})
export class ProjetoCardComponent {
  projeto = input.required<Projeto>();
}
