import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';
import { HomePage } from './pages/home/home.page';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage },
    { path: 'home', component: HomePage },
    { path: '**', redirectTo: 'login' }
];