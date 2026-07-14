import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Atividade } from '../interface/atividade';

@Injectable({
  providedIn: 'root'
})
export class AtividadesService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAtividadesByProjeto(projetoId: number): Observable<Atividade[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Atividade[]>(`${this.apiUrl}/projeto/${projetoId}/atividades`, { headers });
  }

  patchAtividade(atividadeId: number, body: Partial<Atividade>): Observable<Atividade> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch<Atividade>(`${this.apiUrl}/atividade/${atividadeId}`, body, { headers });
  }
}
