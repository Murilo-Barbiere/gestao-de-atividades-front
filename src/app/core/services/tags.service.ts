import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../interface/atividade';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getTags(): Observable<Tag[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Tag[]>(`${this.apiUrl}/tags`, { headers });
  }

  postTag(name: string): Observable<Tag> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<Tag>(`${this.apiUrl}/tags`, { name }, { headers });
  }

  relacionarTagAtividade(atividadeId: number, name: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/atividade/${atividadeId}/tags`, { name }, { headers });
  }
}
