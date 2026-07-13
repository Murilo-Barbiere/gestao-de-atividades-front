import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ProjetosService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getProjetos(): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<any>(`${this.apiUrl}/projeto`, { headers });
    }

    setProjetos(body: { nome: string }): Observable<{ nome: string }> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post<{ nome: string }>(`${this.apiUrl}/projeto`, body, { headers });
    }
}