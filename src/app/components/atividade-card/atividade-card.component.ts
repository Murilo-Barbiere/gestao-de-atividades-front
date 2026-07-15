import { Component, input, signal, computed, inject, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Atividade } from '../../core/interface/atividade';
import { AtividadesService } from '../../core/services/atividades.service';

@Component({
  selector: 'app-atividade-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './atividade-card.component.html',
  styleUrl: './atividade-card.component.css'
})
export class AtividadeCardComponent {
  private atividadesService = inject(AtividadesService);
  private router = inject(Router);

  atividade = input.required<Atividade>();
  statusAlterado = output<void>();
  isCollapsed = signal<boolean>(false);

  temSubAtividades = computed(() => {
    const subs = this.atividade().subAtividades;
    return subs && subs.length > 0;
  });

  toggleCollapse() {
    if (this.temSubAtividades()) {
      this.isCollapsed.update(val => !val);
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority?.toUpperCase()) {
      case 'URGENTE':
        return 'priority-urgente';
      case 'ALTA':
        return 'priority-alta';
      case 'MEDIA':
        return 'priority-media';
      case 'BAIXA':
        return 'priority-baixa';
      default:
        return '';
    }
  }

  onCheckboxClick(event: Event) {
    event.preventDefault();
    const novoStatus = !this.atividade().realizada;
    const msg = novoStatus
      ? 'Tem certeza que deseja marcar esta atividade como realizada?'
      : 'Tem certeza que deseja desmarcar esta atividade como realizada?';

    if (confirm(msg)) {
      this.atividadesService.patchAtividade(this.atividade().id, { realizada: novoStatus }).subscribe({
        next: () => {
          this.statusAlterado.emit();
        },
        error: (err) => {
          console.error('Erro ao atualizar status da atividade:', err);
          alert('Erro ao atualizar o status da atividade.');
        }
      });
    }
  }

  navegarParaAtividade(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/atividade', this.atividade().id]);
  }

  deletarAtividade(event: Event) {
    event.stopPropagation();
    if (confirm('Tem certeza que deseja deletar esta atividade?')) {
      this.atividadesService.deleteAtividade(this.atividade().id).subscribe({
        next: () => {
          this.statusAlterado.emit();
        },
        error: (err) => {
          console.error('Erro ao deletar atividade:', err);
          alert('Erro ao deletar a atividade.');
        }
      });
    }
  }
}
