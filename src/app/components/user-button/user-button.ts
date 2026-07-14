import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/interface/user';

@Component({
  selector: 'app-user-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-button.html',
  styleUrl: './user-button.css',
})
export class UserButton implements OnInit {
  private userService = inject(UserService);

  usuario = signal<User | null>(null);
  carregando = signal<boolean>(true);
  erro = signal<boolean>(false);

  ngOnInit(): void {
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
}