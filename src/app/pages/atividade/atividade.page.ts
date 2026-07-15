import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AtividadesService } from '../../core/services/atividades.service';
import { Atividade } from '../../core/interface/atividade';
import { AtividadePageHeaderComponent } from '../../components/atividade-page-header/atividade-page-header.component';
import { AtividadeInfoSidebarComponent } from '../../components/atividade-info-sidebar/atividade-info-sidebar.component';
import { AtividadeTextoEditorComponent } from '../../components/atividade-texto-editor/atividade-texto-editor.component';
import { HomeHeader } from '../../components/home-header/home-header';

@Component({
  selector: 'app-atividade-page',
  standalone: true,
  imports: [
    CommonModule,
    HomeHeader,
    AtividadePageHeaderComponent,
    AtividadeInfoSidebarComponent,
    AtividadeTextoEditorComponent,
  ],
  templateUrl: './atividade.page.html',
  styleUrl: './atividade.page.css',
})
export class AtividadePage implements OnInit {
  atividade = signal<Atividade | null>(null);
  loading = signal<boolean>(true);
  erro = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private atividadesService: AtividadesService,
  ) {}

  ngOnInit(): void {
    const rawId = this.route.snapshot.paramMap.get('id');
    if (!rawId) {
      this.erro.set('ID de atividade inválido.');
      this.loading.set(false);
      return;
    }
    this.carregarAtividade(Number(rawId));
  }

  carregarAtividade(id: number): void {
    this.loading.set(true);
    this.erro.set(null);
    this.atividadesService.getAtividadeById(id).subscribe({
      next: (data) => {
        this.atividade.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar atividade:', err);
        this.erro.set('Não foi possível carregar a atividade.');
        this.loading.set(false);
      },
    });
  }

  onTextoAtualizado(novoTexto: string): void {
    const atual = this.atividade();
    if (!atual) return;
    this.atividadesService
      .patchAtividade(atual.id, { texto: novoTexto })
      .subscribe({
        next: (atualizada) => {
          this.atividade.set(atualizada);
        },
        error: (err) => {
          console.error('Erro ao salvar texto:', err);
        },
      });
  }

  onStatusAlterado(): void {
    const atual = this.atividade();
    if (!atual) return;
    this.carregarAtividade(atual.id);
  }

  voltarParaProjeto(): void {
    const proj = this.atividade()?.projeto_id;
    if (proj) {
      this.router.navigate(['/projeto', proj]);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
