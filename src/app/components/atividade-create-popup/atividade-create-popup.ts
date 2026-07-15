import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AtividadesService } from '../../core/services/atividades.service';
import { TagsService } from '../../core/services/tags.service';
import { Atividade, PrioridadeAtividade, Tag } from '../../core/interface/atividade';

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

  constructor(
    private atividadesService: AtividadesService,
    private tagsService: TagsService
  ) {}

  titulo = '';
  prioridadeAtividade = PrioridadeAtividade.MEDIA;
  dataVencimento = '';
  paiId: number | null = null;
  
  prioridades = Object.values(PrioridadeAtividade);
  atividadesDoProjeto: Atividade[] = [];

  tagsExistentes: Tag[] = [];
  tagSelecionadaId: number | null = null;
  mostrandoCriarTag = false;
  nomeNovaTag = '';

  carregando = false;
  erro = '';
  sucesso = false;

  ngOnInit(): void {
    this.carregarAtividadesDoProjeto();
    this.carregarTags();
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

  carregarTags(): void {
    this.tagsService.getTags().subscribe({
      next: (tags) => {
        this.tagsExistentes = tags;
      },
      error: (err) => {
        console.error('Erro ao carregar tags:', err);
      }
    });
  }

  toggleCriarTag(): void {
    this.mostrandoCriarTag = !this.mostrandoCriarTag;
    this.nomeNovaTag = '';
  }

  criarTag(): void {
    if (!this.nomeNovaTag.trim()) {
      return;
    }
    this.carregando = true;
    this.tagsService.postTag(this.nomeNovaTag.trim()).subscribe({
      next: (novaTag) => {
        this.tagsExistentes.push(novaTag);
        this.tagSelecionadaId = novaTag.id;
        this.nomeNovaTag = '';
        this.mostrandoCriarTag = false;
        this.carregando = false;
      },
      error: (err) => {
        this.erro = 'Erro ao criar tag.';
        this.carregando = false;
        console.error(err);
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
      next: (atividadeCriada) => {
        if (this.tagSelecionadaId) {
          const tagObj = this.tagsExistentes.find(t => t.id === Number(this.tagSelecionadaId));
          if (tagObj) {
            this.tagsService.relacionarTagAtividade(atividadeCriada.id, tagObj.name).subscribe({
              next: () => {
                this.finalizarCriacao();
              },
              error: (err) => {
                console.error('Erro ao associar tag:', err);
                this.finalizarCriacao();
              }
            });
            return;
          }
        }
        this.finalizarCriacao();
      },
      error: (err) => {
        this.erro = 'Erro ao criar a atividade. Tente novamente.';
        this.carregando = false;
        console.error('Erro na API:', err);
      },
    });
  }

  private finalizarCriacao(): void {
    this.sucesso = true;
    this.carregando = false;

    setTimeout(() => {
      this.atividadeCriada.emit();
      this.fechar.emit();
    }, 900);
  }
}

