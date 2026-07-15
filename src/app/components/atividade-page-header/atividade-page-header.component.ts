import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Atividade } from '../../core/interface/atividade';
import { AtividadesService } from '../../core/services/atividades.service';

@Component({
  selector: 'app-atividade-page-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './atividade-page-header.component.html',
  styleUrl: './atividade-page-header.component.css',
})
export class AtividadePageHeaderComponent {
  private atividadesService = inject(AtividadesService);

  atividade = input.required<Atividade>();
  voltar = output<void>();
  statusAlterado = output<void>();

  salvando = false;

  getPriorityClass(priority: string): string {
    switch (priority?.toUpperCase()) {
      case 'URGENTE': return 'priority-urgente';
      case 'ALTA':    return 'priority-alta';
      case 'MEDIA':   return 'priority-media';
      case 'BAIXA':   return 'priority-baixa';
      default:        return '';
    }
  }

  toggleRealizada(): void {
    const novoStatus = !this.atividade().realizada;
    this.salvando = true;
    this.atividadesService
      .patchAtividade(this.atividade().id, { realizada: novoStatus })
      .subscribe({
        next: () => {
          this.salvando = false;
          this.statusAlterado.emit();
        },
        error: (err) => {
          console.error('Erro ao atualizar status:', err);
          this.salvando = false;
        },
      });
  }

  onVoltar(): void {
    this.voltar.emit();
  }
}
