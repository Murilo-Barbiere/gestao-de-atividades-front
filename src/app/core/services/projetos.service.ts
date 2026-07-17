import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Projeto } from "../interface/projeto";
import { User } from "../interface/user";

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

    putProjeto(idProjeto: number, body: { nome: string }): Observable<Projeto> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.put<Projeto>(`${this.apiUrl}/projeto/${idProjeto}`, body, { headers });
    }

    getProjetoPorId(idProjeto: number): Observable<Projeto> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<Projeto>(`${this.apiUrl}/projeto/${idProjeto}`, { headers });
    }

    // Nota: a rota de listagem de participantes está com um typo na API
    // ("particiapante" em vez de "participante"). Mantido igual ao backend
    // para a chamada funcionar; ajustar aqui se/quando a rota for corrigida.
    getParticipantes(idProjeto: number): Observable<User[]> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get<User[]>(`${this.apiUrl}/projeto/${idProjeto}/participante`, { headers });
    }

    postParticipante(idProjeto: number, email: string): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post<any>(`${this.apiUrl}/projeto/${idProjeto}/participante`, { email }, { headers });
    }

    deleteParticipante(idProjeto: number, idParticipante: number): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.delete<any>(`${this.apiUrl}/projeto/${idProjeto}/participante/${idParticipante}`, { headers });
    }
}