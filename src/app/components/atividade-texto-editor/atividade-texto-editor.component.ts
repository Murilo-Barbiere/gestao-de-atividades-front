import { Component, input, output, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Atividade } from '../../core/interface/atividade';

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
    if (!text) return '<p class="md-empty">Sem conteúdo. Clique em "Editar" para adicionar notas.</p>';

    let html = text;

    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html.replace(/```([\s\S]*?)```/g, '<pre class="md-code-block"><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');

    html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>');

    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="md-blockquote">$1</blockquote>');

    html = html.replace(/^---$/gm, '<hr class="md-hr">');

    html = html.replace(/^[\*\-] (.+)$/gm, '<li class="md-li">$1</li>');
    html = html.replace(/(<li class="md-li">[\s\S]*?<\/li>)/g, '<ul class="md-ul">$1</ul>');

    html = html.replace(/^\d+\. (.+)$/gm, '<li class="md-li md-ol-li">$1</li>');

    html = html.replace(/\[x\] (.+)/gi, '<span class="md-checkbox md-checked">&#10003; $1</span>');
    html = html.replace(/\[ \] (.+)/g, '<span class="md-checkbox">&#9744; $1</span>');

    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="md-link" target="_blank" rel="noopener">$1</a>');

    html = html.replace(/\n{2,}/g, '</p><p class="md-p">');
    html = html.replace(/\n/g, '<br>');
    html = '<p class="md-p">' + html + '</p>';

    html = html.replace(/<p class="md-p"><\/p>/g, '');

    return html;
  }
}
