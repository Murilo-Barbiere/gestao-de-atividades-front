import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/interface/user';

@Component({
  selector: 'app-user-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-popup.html',
  styleUrl: './user-popup.css',
})
export class UserPopup implements OnInit {
  private userService = inject(UserService);

  @Input() usuario!: User;
  @Output() fechar = new EventEmitter<void>();
  @Output() usuarioAtualizado = new EventEmitter<User>();

  editando = false;
  nome = '';
  email = '';
  senha = '';

  carregando = false;
  erro = '';
  sucesso = '';

  ngOnInit(): void {
    this.resetarCampos();
  }

  resetarCampos(): void {
    if (this.usuario) {
      this.nome = this.usuario.name;
      this.email = this.usuario.email;
      this.senha = '';
    }
  }

  ativarEdicao(): void {
    this.editando = true;
    this.erro = '';
    this.sucesso = '';
    this.resetarCampos();
  }

  cancelarEdicao(): void {
    this.editando = false;
    this.resetarCampos();
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

  salvar(): void {
    if (!this.nome.trim() || !this.email.trim()) {
      this.erro = 'Nome e e-mail são obrigatórios.';
      return;
    }

    if (!this.senha) {
      this.erro = 'Digite a senha para confirmar as alterações.';
      return;
    }

    this.carregando = true;
    this.erro = '';
    this.sucesso = '';

    const payload = {
      name: this.nome,
      email: this.email,
      senha: this.senha
    };

    this.userService.updateUser(payload).subscribe({
      next: (usuarioAtualizado) => {
        this.sucesso = 'Dados atualizados com sucesso!';
        this.carregando = false;
        this.usuarioAtualizado.emit(usuarioAtualizado);
        setTimeout(() => {
          this.editando = false;
          this.sucesso = '';
        }, 1500);
      },
      error: (err) => {
        this.carregando = false;
        this.erro = 'Erro ao atualizar dados. Verifique a senha ou tente novamente.';
        console.error('Erro ao atualizar usuário:', err);
      }
    });
  }
}
