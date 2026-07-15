import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AtividadeListaComponent } from '../../components/atividade-lista/atividade-lista.component';
import { HomeHeader } from '../../components/home-header/home-header';
import { ProjetoEditPopupComponent } from '../../components/projeto-edit-popup/projeto-edit-popup.component';
import { ProjetosService } from '../../core/services/projetos.service';

@Component({
  selector: 'app-projeto.page',
  imports: [CommonModule, AtividadeListaComponent, HomeHeader, ProjetoEditPopupComponent],
  templateUrl: './projeto.page.html',
  styleUrl: './projeto.page.css',
})
export class ProjetoPage implements OnInit {
  projetoId = signal<number | null>(null);
  nomeProjeto = signal<string>('');
  mostrarEditPopup = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private projetosService: ProjetosService
  ) {}

  ngOnInit() {
    const rawId = this.route.snapshot.paramMap.get('id');
    if (rawId) {
      const id = Number(rawId);
      this.projetoId.set(id);
      this.carregarProjeto(id);
    }
  }

  // Busca o projeto para exibir o nome atual no popup
  carregarProjeto(id: number): void {
    this.projetosService.getProjetoPorId(id).subscribe({
      next: (projeto) => {
        this.nomeProjeto.set(projeto.nome);
      },
      error: (err) => {
        console.error('Erro ao carregar projeto:', err);
      }
    });
  }

  abrirEditPopup(): void {
    this.mostrarEditPopup.set(true);
  }

  fecharEditPopup(): void {
    this.mostrarEditPopup.set(false);
  }

  // Recebe o novo nome emitido pelo popup e atualiza o signal local
  onProjetoEditado(novoNome: string): void {
    this.nomeProjeto.set(novoNome);
  }
}
