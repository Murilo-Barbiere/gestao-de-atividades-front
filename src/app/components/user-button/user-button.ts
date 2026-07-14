import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/interface/user';
import { UserPopup } from '../user-popup/user-popup';

@Component({
  selector: 'app-user-button',
  standalone: true,
  imports: [CommonModule, UserPopup],
  templateUrl: './user-button.html',
  styleUrl: './user-button.css',
})
export class UserButton implements OnInit {
  private userService = inject(UserService);

  usuario = signal<User | null>(null);
  carregando = signal<boolean>(true);
  erro = signal<boolean>(false);
  exibirPopup = signal<boolean>(false);

  ngOnInit(): void {
    this.carregarUsuario();
  }

  carregarUsuario(): void {
    this.userService.getUser().subscribe({
      next: (usuario) => {
        this.usuario.set(usuario);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      },
    });
  }

  abrirPopup(): void {
    if (this.usuario()) {
      this.exibirPopup.set(true);
    }
  }

  fecharPopup(): void {
    this.exibirPopup.set(false);
  }

  onUsuarioAtualizado(usuarioAtualizado: User): void {
    this.usuario.set(usuarioAtualizado);
  }
}