import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AtividadeListaComponent } from '../../components/atividade-lista/atividade-lista.component';

@Component({
  selector: 'app-projeto.page',
  imports: [AtividadeListaComponent],
  templateUrl: './projeto.page.html',
  styleUrl: './projeto.page.css',
})
export class ProjetoPage implements OnInit {
  projetoId = signal<number | null>(null);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const rawId = this.route.snapshot.paramMap.get('id');
    if (rawId) {
      this.projetoId.set(Number(rawId));
    }
  }
}
