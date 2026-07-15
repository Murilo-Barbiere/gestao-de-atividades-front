import { Component, signal, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AtividadeListaComponent } from '../../components/atividade-lista/atividade-lista.component';
import { HomeHeader } from '../../components/home-header/home-header';
import { ProjetoEditPopupComponent } from '../../components/projeto-edit-popup/projeto-edit-popup.component';
import { AtividadeCreatePopupComponent } from '../../components/atividade-create-popup/atividade-create-popup';
import { ProjetosService } from '../../core/services/projetos.service';

@Component({
  selector: 'app-projeto.page',
  imports: [CommonModule, AtividadeListaComponent, HomeHeader, ProjetoEditPopupComponent, AtividadeCreatePopupComponent],
  templateUrl: './projeto.page.html',
  styleUrl: './projeto.page.css',
})
export class ProjetoPage implements OnInit {
  @ViewChild(AtividadeListaComponent) atividadeListaComponent!: AtividadeListaComponent;

  projetoId = signal<number | null>(null);
  nomeProjeto = signal<string>('');
  mostrarEditPopup = signal<boolean>(false);
  mostrarCreateAtividadePopup = signal<boolean>(false);

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

  onProjetoEditado(novoNome: string): void {
    this.nomeProjeto.set(novoNome);
  }

  abrirCreateAtividadePopup(): void {
    this.mostrarCreateAtividadePopup.set(true);
  }

  fecharCreateAtividadePopup(): void {
    this.mostrarCreateAtividadePopup.set(false);
  }

  onAtividadeCriada(): void {
    const id = this.projetoId();
    if (id && this.atividadeListaComponent) {
      this.atividadeListaComponent.carregarAtividades(id, this.atividadeListaComponent.filtros());
    }
  }
}
