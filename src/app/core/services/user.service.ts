import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment.development';
import { TokenPayload } from '../interface/token-payload';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUser(): Observable<User> {
    const token = localStorage.getItem('token') ?? '';

    if (!token) {
      throw new Error('Usuário não está logado ou token não encontrado.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const payloadDecodificado = jwtDecode<TokenPayload>(token);
    const userId = payloadDecodificado.id;

    return this.http.get<User>(`${this.apiUrl}/users/${userId}`, { headers });
  }

  updateUser(userData: { name: string; email: string; senha?: string }): Observable<User> {
    const token = localStorage.getItem('token') ?? '';

    if (!token) {
      throw new Error('Usuário não está logado ou token não encontrado.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const payloadDecodificado = jwtDecode<TokenPayload>(token);
    const userId = payloadDecodificado.id;

    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, userData, { headers });
  }
}