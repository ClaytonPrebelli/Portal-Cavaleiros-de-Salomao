import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardGuard } from './core/guards/auth-guard.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home-logado/home-logado.component').then(m => m.HomeLogadoComponent),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'meu-painel',
    loadComponent: () => import('./pages/painel/home-painel/home-painel.component').then(m => m.HomePainelComponent),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'cadastros/noticias',
    loadComponent: () => import('./pages/cadastros/noticias/noticias.component').then(m => m.NoticiasComponent),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'cadastros/noticias/:id',
    loadComponent: () => import('./pages/cadastros/noticia-form/noticia-form.component').then(m => m.NoticiaFormComponent),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'cadastros/macons',
    loadComponent: () => import('./pages/cadastros/macons/macons.component').then(m => m.MaconsComponent),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'cadastros/macons/:id',
    loadComponent: () => import('./pages/cadastros/macon/macon.component').then(m => m.MaconComponent),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'ficha/macons/:id',
    loadComponent: () => import('./pages/shared/ficha-macom/ficha-macom.component').then(m => m.FichaMacomComponent),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'documentos/macons/:id',
    loadComponent: () => import('./pages/cadastros/macon/documento/documento.component').then(m => m.DocumentoComponent),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'ficha/candidato/:id',
    loadComponent: () => import('./pages/shared/ficha-candidato/ficha-candidato.component').then(m => m.FichaCandidatoComponent),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'cadastro/candidato/:token',
    loadComponent: () => import('./pages/cadastros/candidatos/candidatos.component').then(m => m.CandidatosComponent)
  },
  {
    path: 'candidatos',
    loadComponent: () => import('./pages/cadastros/lista-candidatos/lista-candidatos.component').then(m => m.ListaCandidatosComponent),
    canActivate: [AuthGuardGuard]
  },
  {
    path: 'biblioteca',
    loadComponent: () => import('./pages/biblioteca/biblioteca.component').then(m => m.BibliotecaComponent),
    canActivate: [AuthGuardGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
