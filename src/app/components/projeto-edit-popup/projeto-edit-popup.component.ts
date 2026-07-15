import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjetosService } from '../../core/services/projetos.service';

@Component({
  selector: 'app-projeto-edit-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projeto-edit-popup.component.html',
  styleUrl: './projeto-edit-popup.component.css',
})
export class ProjetoEditPopupComponent implements OnInit {
  // Recebe o id e o nome atual do projeto vindo do pai (projeto.page.ts)
  @Input() projetoId!: number;
  @Input() nomeAtual!: string;

  // Emite para o pai fechar o popup ou avisar que o projeto foi editado
  @Output() fechar = new EventEmitter<void>();
  @Output() projetoEditado = new EventEmitter<string>();

  constructor(private projetosService: ProjetosService) {}

  nome = '';
  carregando = false;
  erro = '';
  sucesso = false;

  ngOnInit(): void {
    // Preenche o campo com o nome atual do projeto
    this.nome = this.nomeAtual;
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

  salvarEdicao(): void {
    if (this.nome.trim().length < 3) {
      this.erro = 'O nome deve ter pelo menos 3 caracteres.';
      return;
    }

    this.carregando = true;
    this.erro = '';

    this.projetosService.putProjeto(this.projetoId, { nome: this.nome.trim() }).subscribe({
      next: (projetoAtualizado) => {
        this.sucesso = true;
        this.carregando = false;

        setTimeout(() => {
          // Emite o novo nome para o pai atualizar o estado local
          this.projetoEditado.emit(projetoAtualizado.nome);
          this.fechar.emit();
        }, 900);
      },
      error: (err) => {
        this.erro = 'Erro ao salvar. Tente novamente.';
        this.carregando = false;
        console.error('Erro na API:', err);
      },
    });
  }
}
