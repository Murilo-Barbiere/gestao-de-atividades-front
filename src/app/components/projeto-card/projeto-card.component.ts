import { Component, input, computed, output } from '@angular/core';
import { Projeto } from '../../core/interface/projeto';
import { Router } from '@angular/router';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-projeto-card',
  imports: [SlicePipe],
  templateUrl: './projeto-card.component.html',
  styleUrl: './projeto-card.component.css',
  standalone: true
})
export class ProjetoCardComponent {
  constructor(private router: Router) {}

  projeto = input.required<Projeto>();
  selecionar = output<number>();

  participantesExibidos = computed(() => this.projeto().participantes.slice(0, 2));
  temMaisParticipantes = computed(() => this.projeto().participantes.length > 2);
  
  onClick() {
    this.selecionar.emit(this.projeto().id);
  }

  abrirProjeto() {
    this.router.navigate(['/projeto', this.projeto().id]);
  }
}