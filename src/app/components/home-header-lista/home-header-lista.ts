import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjetoCreatePopup } from '../projeto-create-popup/projeto-create-popup';

@Component({
  selector: 'app-home-header-lista',
  standalone: true,
  imports: [CommonModule, ProjetoCreatePopup],
  templateUrl: './home-header-lista.html',
  styleUrl: './home-header-lista.css',
})
export class HomeHeaderLista {
  popupAberto = signal(false);

  abrirPopup(): void {
    this.popupAberto.set(true);
  }

  fecharPopup(): void {
    this.popupAberto.set(false);
  }
}
