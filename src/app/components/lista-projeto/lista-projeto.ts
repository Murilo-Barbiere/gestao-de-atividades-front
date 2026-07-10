import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjetosService } from '../../core/services/projetos.service';
import { Projeto } from '../../core/interface/projeto';
import { ProjetoCardComponent } from "../projeto-card/projeto-card.component";

@Component({
  selector: 'app-lista-projeto',
  standalone: true,
  imports: [
      CommonModule, 
      ProjetoCardComponent,
    ],
  templateUrl: './lista-projeto.html',
  styleUrl: './lista-projeto.css'
})
export class ListaProjeto implements OnInit {
  projetos = signal<Projeto[]>([]);
  carregando = signal(true);
  erro = signal('');

  constructor(private projetosService: ProjetosService) {}

  ngOnInit(): void {
    this.projetosService.getProjetos().subscribe({
      next: (data) => {
        this.projetos.set(data);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set('Erro ao carregar os projetos.');
        this.carregando.set(false);
        console.error('Erro na API:', err);
      }
    });
  }
}