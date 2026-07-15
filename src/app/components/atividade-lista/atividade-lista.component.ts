import { Component, input, inject, effect, signal, computed } from '@angular/core';
import { CommonModule, NgTemplateOutlet, DatePipe } from '@angular/common';
import { AtividadesService } from '../../core/services/atividades.service';
import { Atividade, AtividadeFiltro } from '../../core/interface/atividade';
import { AtividadeCardComponent } from '../atividade-card/atividade-card.component';
import { ProjetoBuscaComponent } from '../projeto-busca/atividade_busca.component';

@Component({
  selector: 'app-atividade-lista',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet, DatePipe, AtividadeCardComponent, ProjetoBuscaComponent],
  templateUrl: './atividade-lista.component.html',
  styleUrl: './atividade-lista.component.css'
})
export class AtividadeListaComponent {
  private atividadesService = inject(AtividadesService);

  projetoId = input.required<number>();
  filtros = signal<AtividadeFiltro>({});
  atividades = signal<Atividade[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  totalAtividades = computed(() => {
    return this.contarAtividades(this.atividades());
  });

  private contarAtividades(lista: Atividade[]): number {
    let count = 0;
    for (const at of lista) {
      count++;
      if (at.subAtividades && at.subAtividades.length > 0) {
        count += this.contarAtividades(at.subAtividades);
      }
    }
    return count;
  }

  constructor() {
    effect(() => {
      const id = this.projetoId();
      const currentFiltros = this.filtros();
      if (id) {
        this.carregarAtividades(id, currentFiltros);
      }
    });
  }

  carregarAtividades(id: number, currentFiltros?: AtividadeFiltro) {
    this.loading.set(true);
    this.error.set(null);
    this.atividadesService.getAtividadesByProjeto(id, currentFiltros).subscribe({
      next: (data) => {
        this.atividades.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar atividades:', err);
        this.error.set('Não foi possível carregar as atividades deste projeto.');
        this.loading.set(false);
      }
    });
  }

  onFiltroAlterado(novoFiltro: AtividadeFiltro) {
    this.filtros.set(novoFiltro);
  }

  trackById(index: number, item: Atividade): number {
    return item.id;
  }
}
