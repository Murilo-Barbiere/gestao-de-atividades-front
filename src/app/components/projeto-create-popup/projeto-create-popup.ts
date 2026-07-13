import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjetosService } from '../../core/services/projetos.service';

@Component({
  selector: 'app-projeto-create-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projeto-create-popup.html',
  styleUrl: './projeto-create-popup.css',
})
export class ProjetoCreatePopup {
  @Output() fechar = new EventEmitter<void>();
  @Output() projetoCriado = new EventEmitter<void>();

  constructor(private projetosService: ProjetosService) {}

  // Variáveis simples, sem signals nem FormGroup
  nome = '';
  carregando = false;
  erro = '';
  sucesso = false;

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

  criarProjeto(): void {
    // Validação simples, sem Validators do Angular
    if (this.nome.trim().length < 3) {
      this.erro = 'O nome deve ter pelo menos 3 caracteres.';
      return;
    }

    this.carregando = true;
    this.erro = '';

    this.projetosService.setProjetos({ nome: this.nome } as any).subscribe({
      next: () => {
        this.sucesso = true;
        this.carregando = false;

        setTimeout(() => {
          this.projetoCriado.emit();
          this.fechar.emit();
        }, 900);
      },
      error: (err) => {
        this.erro = 'Erro ao criar o projeto. Tente novamente.';
        this.carregando = false;
        console.error('Erro na API:', err);
      },
    });
  }
}