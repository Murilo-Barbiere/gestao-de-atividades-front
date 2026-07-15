import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Atividade } from '../../core/interface/atividade';

@Component({
  selector: 'app-atividade-info-sidebar',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './atividade-info-sidebar.component.html',
  styleUrl: './atividade-info-sidebar.component.css',
})
export class AtividadeInfoSidebarComponent {
  atividade = input.required<Atividade>();

  getPriorityClass(priority: string): string {
    switch (priority?.toUpperCase()) {
      case 'URGENTE': return 'priority-urgente';
      case 'ALTA':    return 'priority-alta';
      case 'MEDIA':   return 'priority-media';
      case 'BAIXA':   return 'priority-baixa';
      default:        return '';
    }
  }
}
