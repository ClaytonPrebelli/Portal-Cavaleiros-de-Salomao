import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeLogadoComponent } from './pages/home-logado/home-logado.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuardGuard } from './core/guards/auth-guard.guard';
import { NoticiasComponent } from './pages/cadastros/noticias/noticias.component';
import { NoticiaFormComponent } from './pages/cadastros/noticia-form/noticia-form.component';
import { MaconsComponent } from './pages/cadastros/macons/macons.component';
import { MaconComponent } from './pages/cadastros/macon/macon.component';
import { FichaMacomComponent } from './pages/shared/ficha-macom/ficha-macom.component';
import { HomePainelComponent } from './pages/painel/home-painel/home-painel.component';
import { CandidatosComponent } from './pages/cadastros/candidatos/candidatos.component';
import { ListaCandidatosComponent } from './pages/cadastros/lista-candidatos/lista-candidatos.component';
import { FichaCandidatoComponent } from './pages/shared/ficha-candidato/ficha-candidato.component';
import { BibliotecaComponent } from './pages/biblioteca/biblioteca.component';
import { DocumentoComponent } from './pages/cadastros/macon/documento/documento.component';

const routes: Routes = [
  {
path:'',
component:LoginComponent
},
{
  path:'home',
  component:HomeLogadoComponent,
  canActivate:[AuthGuardGuard]
},
{
  path:'cadastros/noticias',
  component:NoticiasComponent
},
{
  path:'cadastros/macons',
  component:MaconsComponent
},
{
  path:"meu-painel",
  component:HomePainelComponent
},
{
  path:"cadastros/noticias/:id",
  component:NoticiaFormComponent
},
{
  path:'cadastros/macons/:id',
  component:MaconComponent
},
{
  path:'ficha/macons/:id',
  component:FichaMacomComponent
},
{
  path:'documentos/macons/:id',
  component:DocumentoComponent
}, 
{
  path:'ficha/candidato/:id',
  component:FichaCandidatoComponent
},
{
  path:'cadastro/candidato/:token',
  component:CandidatosComponent
},
{
  path:'candidatos',
  component: ListaCandidatosComponent
},
{
  path:"biblioteca",
  component:BibliotecaComponent
},
{
  path:"**",
  component:LoginComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
