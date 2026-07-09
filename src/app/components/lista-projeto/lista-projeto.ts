import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjetosService } from '../../core/services/projetos.service';
import { Projeto } from '../../core/interface/projeto';

@Component({
  selector: 'app-lista-projeto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-projeto.html',
  styleUrl: './lista-projeto.css'
})
export class ListaProjeto implements OnInit {
  projetos: Projeto[] = [];
  carregando = true;
  erro = '';

  constructor(private projetosService: ProjetosService) {}

  ngOnInit(): void {
    this.projetosService.getProjetos().subscribe({
      next: (data) => {
        this.projetos = data;
        this.carregando = false;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar os projetos.';
        this.carregando = false;
        console.error('Erro na API:', err);
      }
    });
  }
}