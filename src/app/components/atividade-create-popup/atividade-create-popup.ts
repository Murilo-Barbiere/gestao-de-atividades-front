import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AtividadesService } from '../../core/services/atividades.service';
import { Atividade, PrioridadeAtividade } from '../../core/interface/atividade';

@Component({
  selector: 'app-atividade-create-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atividade-create-popup.html',
  styleUrl: './atividade-create-popup.css',
})
export class AtividadeCreatePopupComponent implements OnInit {
  @Input({ required: true }) projetoId!: number;
  @Output() fechar = new EventEmitter<void>();
  @Output() atividadeCriada = new EventEmitter<void>();

  constructor(private atividadesService: AtividadesService) {}

  titulo = '';
  prioridadeAtividade = PrioridadeAtividade.MEDIA;
  dataVencimento = '';
  paiId: number | null = null;
  
  prioridades = Object.values(PrioridadeAtividade);
  atividadesDoProjeto: Atividade[] = [];

  carregando = false;
  erro = '';
  sucesso = false;

  ngOnInit(): void {
    this.carregarAtividadesDoProjeto();
  }

  carregarAtividadesDoProjeto(): void {
    this.atividadesService.getAtividadesByProjeto(this.projetoId).subscribe({
      next: (lista) => {
        this.atividadesDoProjeto = this.achatarAtividades(lista);
      },
      error: (err) => {
        console.error('Erro ao carregar atividades do projeto:', err);
      }
    });
  }

  private achatarAtividades(lista: Atividade[]): Atividade[] {
    const flat: Atividade[] = [];
    const recurse = (itens: Atividade[]) => {
      for (const item of itens) {
        flat.push(item);
        if (item.subAtividades && item.subAtividades.length > 0) {
          recurse(item.subAtividades);
        }
      }
    };
    recurse(lista);
    return flat;
  }

  fecharPopup(): void {
    if (!this.carregando) {
      this.fechar.emit();
    }
  }

  onOverlayClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('popup-overlay')) {
      this.fecharPopup();
    }
  }

  criarAtividade(): void {
    if (this.titulo.trim().length < 3) {
      this.erro = 'O título deve ter pelo menos 3 caracteres.';
      return;
    }

    if (!this.dataVencimento) {
      this.erro = 'A data de vencimento é obrigatória.';
      return;
    }

    this.carregando = true;
    this.erro = '';

    const dados = {
      titulo: this.titulo.trim(),
      idProjeto: Number(this.projetoId),
      prioridadeAtividade: this.prioridadeAtividade,
      dataVencimento: new Date(this.dataVencimento).toISOString(),
      texto: '',
      ...(this.paiId ? { paiId: Number(this.paiId) } : {})
    };

    this.atividadesService.postAtividade(dados).subscribe({
      next: () => {
        this.sucesso = true;
        this.carregando = false;

        setTimeout(() => {
          this.atividadeCriada.emit();
          this.fechar.emit();
        }, 900);
      },
      error: (err) => {
        this.erro = 'Erro ao criar a atividade. Tente novamente.';
        this.carregando = false;
        console.error('Erro na API:', err);
      },
    });
  }
}
