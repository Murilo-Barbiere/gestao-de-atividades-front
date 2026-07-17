import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjetosService } from '../../core/services/projetos.service';
import { User } from '../../core/interface/user';

@Component({
  selector: 'app-participante-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participante-popup.component.html',
  styleUrl: './participante-popup.component.css',
})
export class ParticipantePopupComponent implements OnInit {
  // Recebe o id do projeto vindo do pai (projeto.page.ts)
  @Input({ required: true }) projetoId!: number;

  // Emite para o pai fechar o popup ou avisar que a lista de participantes mudou
  @Output() fechar = new EventEmitter<void>();
  @Output() participantesAtualizados = new EventEmitter<User[]>();

  constructor(private projetosService: ProjetosService) {}

  participantes: User[] = [];
  emailNovoParticipante = '';

  carregandoLista = false;
  adicionando = false;
  removendoId: number | null = null;

  erro = '';
  erroAdicionar = '';

  ngOnInit(): void {
    this.carregarParticipantes();
  }

  carregarParticipantes(): void {
    this.carregandoLista = true;
    this.erro = '';

    this.projetosService.getParticipantes(this.projetoId).subscribe({
      next: (participantes) => {
        this.participantes = participantes;
        this.carregandoLista = false;
        this.participantesAtualizados.emit(this.participantes);
      },
      error: (err) => {
        this.erro = 'Não foi possível carregar os participantes.';
        this.carregandoLista = false;
        console.error('Erro ao carregar participantes:', err);
      },
    });
  }

  adicionarParticipante(): void {
    const email = this.emailNovoParticipante.trim();

    if (!email) {
      this.erroAdicionar = 'Informe um e-mail.';
      return;
    }

    if (!this.emailValido(email)) {
      this.erroAdicionar = 'Informe um e-mail válido.';
      return;
    }

    if (this.participantes.some((p) => p.email.toLowerCase() === email.toLowerCase())) {
      this.erroAdicionar = 'Este participante já está no projeto.';
      return;
    }

    this.adicionando = true;
    this.erroAdicionar = '';

    this.projetosService.postParticipante(this.projetoId, email).subscribe({
      next: () => {
        this.emailNovoParticipante = '';
        this.adicionando = false;
        // Recarrega a lista para refletir o participante recém-adicionado
        // (o carregarParticipantes já emite participantesAtualizados ao terminar)
        this.carregarParticipantes();
      },
      error: (err) => {
        this.erroAdicionar = 'Erro ao adicionar participante. Verifique o e-mail e tente novamente.';
        this.adicionando = false;
        console.error('Erro ao adicionar participante:', err);
      },
    });
  }

  removerParticipante(participante: User): void {
    if (!confirm(`Remover ${participante.name} deste projeto?`)) {
      return;
    }

    this.removendoId = participante.id;
    this.erro = '';

    this.projetosService.deleteParticipante(this.projetoId, participante.id).subscribe({
      next: () => {
        this.participantes = this.participantes.filter((p) => p.id !== participante.id);
        this.removendoId = null;
        this.participantesAtualizados.emit(this.participantes);
      },
      error: (err) => {
        this.erro = 'Erro ao remover participante. Tente novamente.';
        this.removendoId = null;
        console.error('Erro ao remover participante:', err);
      },
    });
  }

  fecharPopup(): void {
    this.fechar.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('popup-overlay')) {
      this.fecharPopup();
    }
  }

  private emailValido(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}