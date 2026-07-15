import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';
import { HomePage } from './pages/home/home.page';
import { ProjetoPage } from './pages/projeto/projeto.page';
import { AtividadePage } from './pages/atividade/atividade.page';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: 'home', component: HomePage },
    { path: 'projeto/:id', component: ProjetoPage},
    { path: 'atividade/:id', component: AtividadePage },
    { path: '**', redirectTo: 'login' },
];