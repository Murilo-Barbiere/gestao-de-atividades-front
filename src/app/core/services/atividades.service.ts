import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Atividade, AtividadeFiltro, PrioridadeAtividade } from '../interface/atividade';

export interface AtividadeCreateDto {
  titulo: string;
  idProjeto: number;
  prioridadeAtividade: PrioridadeAtividade;
  dataVencimento: string; 
  paiId?: number;
  texto?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AtividadesService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAtividadesByProjeto(projetoId: number, filtros?: AtividadeFiltro): Observable<Atividade[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && key !== 'idProjeto') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<Atividade[]>(`${this.apiUrl}/projeto/${projetoId}/atividades`, { headers, params });
  }

  patchAtividade(atividadeId: number, body: Partial<Atividade>): Observable<Atividade> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch<Atividade>(`${this.apiUrl}/atividade/${atividadeId}`, body, { headers });
  }

  postAtividade(dados: AtividadeCreateDto): Observable<Atividade> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Atividade>(`${this.apiUrl}/atividade`, dados, { headers });
  }

  getAtividadeById(atividadeId: number): Observable<Atividade> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Atividade>(`${this.apiUrl}/atividade/${atividadeId}`, { headers });
  }

  deleteAtividade(atividadeId: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<void>(`${this.apiUrl}/atividade/${atividadeId}`, { headers });
  }
}

