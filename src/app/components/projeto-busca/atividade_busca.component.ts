import { Component, OnInit, output, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AtividadeFiltro, PrioridadeAtividade, AtividadeOrdenacao, StatusFiltro } from '../../core/interface/atividade';

@Component({
  selector: 'app-projeto-busca',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './atividade_busca.component.html',
  styleUrl: './atividade_busca.component.css'
})
export class ProjetoBuscaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  filtroAlterado = output<AtividadeFiltro>();

  prioridades = Object.values(PrioridadeAtividade);
  ordenacoes = Object.values(AtividadeOrdenacao);
  statusOpcoes = Object.values(StatusFiltro);

  form = this.fb.group({
    busca: [''],
    prioridade: [''],
    status: ['todas'],
    sort: [''],
    order: ['asc']
  });

  ngOnInit(): void {
    const busca$ = this.form.controls.busca.valueChanges.pipe(
      startWith(this.form.controls.busca.value),
      debounceTime(300),
      distinctUntilChanged()
    );

    const outrosFiltros$ = combineLatest({
      prioridade: this.form.controls.prioridade.valueChanges.pipe(startWith(this.form.controls.prioridade.value)),
      status: this.form.controls.status.valueChanges.pipe(startWith(this.form.controls.status.value)),
      sort: this.form.controls.sort.valueChanges.pipe(startWith(this.form.controls.sort.value)),
      order: this.form.controls.order.valueChanges.pipe(startWith(this.form.controls.order.value))
    });

    combineLatest([busca$, outrosFiltros$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([busca, outros]) => {
        const filtroBruto = {
          busca,
          ...outros
        };

        const filtroLimpo = Object.entries(filtroBruto).reduce((acc, [key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            if (key === 'order' && !filtroBruto.sort) {
              return acc;
            }
            acc[key as keyof AtividadeFiltro] = val as any;
          }
          return acc;
        }, {} as AtividadeFiltro);

        this.filtroAlterado.emit(filtroLimpo);
      });
  }

  limparFiltros(): void {
    this.form.patchValue({
      busca: '',
      prioridade: '',
      status: 'todas',
      sort: '',
      order: 'asc'
    });
  }

  getPrioridadeLabel(prio: string): string {
    const labels: Record<string, string> = {
      URGENTE: 'Urgente',
      ALTA: 'Alta',
      MEDIA: 'Média',
      BAIXA: 'Baixa'
    };
    return labels[prio] || prio;
  }

  getOrdenacaoLabel(ord: string): string {
    const labels: Record<string, string> = {
      prioridade: 'Prioridade',
      dataCriacao: 'Data de Criação',
      dataVencimento: 'Data de Vencimento',
      titulo: 'Título'
    };
    return labels[ord] || ord;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      todas: 'Todas',
      pendente: 'Pendentes',
      concluida: 'Concluídas',
      vencida: 'Vencidas'
    };
    return labels[status] || status;
  }
}
