import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjetoCreatePopup } from '../projeto-create-popup/projeto-create-popup';

@Component({
  selector: 'app-home-header',
  standalone: true,
  imports: [CommonModule, ProjetoCreatePopup],
  templateUrl: './home-header.html',
  styleUrl: './home-header.css',
})
export class HomeHeader {
  popupAberto = signal(false);

  abrirPopup(): void {
    this.popupAberto.set(true);
  }

  fecharPopup(): void {
    this.popupAberto.set(false);
  }
}
