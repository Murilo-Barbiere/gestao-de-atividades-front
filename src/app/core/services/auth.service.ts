import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;
    
    login(data: any): Observable<any>{
        return this.http.post<any>(`${this.apiUrl}/auth/login`, data).pipe(
            tap(response =>{
                if(response && response.tokenJwt){
                    localStorage.setItem('token', response.tokenJwt);
                }
            })
        );
    }

    register(data: any): Observable<any>{
        return this.http.post<any>(`${this.apiUrl}/auth/register`, data).pipe(
            tap(response =>{
                if(response && response.tokenJwt){
                    localStorage.setItem('token', response.tokenJwt);
                };
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token'); 
    }
}
