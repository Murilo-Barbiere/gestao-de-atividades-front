import { Component, input, output, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Atividade } from '../../core/interface/atividade';
import { renderMarkdown as renderMarkdownUtil } from '../../core/utils/markdown-renderer';

@Component({
  selector: 'app-atividade-texto-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atividade-texto-editor.component.html',
  styleUrl: './atividade-texto-editor.component.css',
})
export class AtividadeTextoEditorComponent implements OnChanges {
  atividade = input.required<Atividade>();
  textoAtualizado = output<string>();

  modo = signal<'preview' | 'edit'>('preview');
  textoEditavel = signal<string>('');
  salvando = signal<boolean>(false);
  salvoRecentemente = signal<boolean>(false);

  private ultimoAtividadeId: number | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['atividade']) {
      const nova = this.atividade();
      if (nova.id !== this.ultimoAtividadeId) {
        this.ultimoAtividadeId = nova.id;
        this.textoEditavel.set(nova.texto ?? '');
      }
    }
  }

  alternarModo(): void {
    if (this.modo() === 'preview') {
      this.modo.set('edit');
    } else {
      this.modo.set('preview');
    }
  }

  onTextoChange(valor: string): void {
    this.textoEditavel.set(valor);
  }

  salvarTexto(): void {
    this.salvando.set(true);
    this.textoAtualizado.emit(this.textoEditavel());
    setTimeout(() => {
      this.salvando.set(false);
      this.salvoRecentemente.set(true);
      setTimeout(() => this.salvoRecentemente.set(false), 2000);
    }, 600);
  }

  renderMarkdown(text: string): string {
    return renderMarkdownUtil(text);
  }
}
