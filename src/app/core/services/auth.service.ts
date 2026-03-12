import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FamiliaresInterface, LoginParams, LoginResponse, NiverFamiliaInterface, UsuariosInterface } from './../interfaces/login';
import { Observable } from 'rxjs';
import { Envs } from './envs';
import { StatusInterface } from '../interfaces/status';

import { CandidatoInterface } from '../interfaces/candidato';
import { PaginatorInterface } from '../interfaces/paginator';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  headers = new HttpHeaders()
    // .append('Access-Control-Allow-Origin', '*')
    // .append('Access-Control-Allow-Headers', '*')
    // .append(
    //   'Access-Control-Allow-Methods',
    //   'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    // )
 //   .append('mode', 'no-cors');
  headers2 = new HttpHeaders()
    // .append('Access-Control-Allow-Origin', '*')
    // .append('Access-Control-Allow-Headers', '*')
    // .append(
    //   'Access-Control-Allow-Methods',
    //   'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    // )
 //   .append('mode', 'no-cors')
    //.append('Content-Type', 'application/json');

  headers3 = new HttpHeaders()
    // .append('Access-Control-Allow-Origin', '*')
    // .append('Access-Control-Allow-Headers', '*')
   
    // .append('Content-Type', 'application/json');

  login(login: LoginParams): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${Envs.apiUrl}Usuarios/Login`,
      login,
      { headers: this.headers }
    );
  }
  verificaAtivo(id: number): Observable<LoginResponse> {
    return this.http.get<LoginResponse>(
      `${Envs.apiUrl}Usuarios/VerificaAtivo/?id=${id}`,
      { headers: this.headers }
    );
  }
  listarMacons(
    page?: number,
    loja?: number,
    status?: number,
    termo?: string
  ): Observable<PaginatorInterface> {
    return this.http.get<PaginatorInterface>(
      `${Envs.apiUrl}Usuarios/ListarUsuarios?page=${page}&loja=${loja}&status=${status}&termo=${termo}`,
      { headers: this.headers }
    );
  }
  listarStatus(): Observable<StatusInterface[]> {
    return this.http.get<StatusInterface[]>(
      `${Envs.apiUrl}Usuarios/VerStatus`,
      { headers: this.headers }
    );
  }
  cadastrarMacom(macom: UsuariosInterface): Observable<UsuariosInterface> {
    var param = JSON.parse(JSON.stringify(macom));
    return this.http.post<UsuariosInterface>(
      `${Envs.apiUrl}Usuarios/CadastrarUsuario`,
      param,
      { headers: this.headers2 }
    );
  }
  gravarFotoIUser(foto: File, id: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', foto);
    return this.http.post<any>(
      `${Envs.apiUrl}Fotos/GravarFotoUser?id=${id}`,
      formData,
      { headers: this.headers }
    );
  }
  verMacom(id: number | any): Observable<UsuariosInterface> {
    return this.http.get<UsuariosInterface>(
      `${Envs.apiUrl}Usuarios/VerUsuario?id=${id}`,
      { headers: this.headers }
    );
  }

  gerarToken(id: number): Observable<any> {
    return this.http.get<any>(
      `${Envs.apiUrl}Candidatos/GerarTokenCandidato?id=${id}`,
      { headers: this.headers }
    );
  }
  validaToken(token: string): Observable<any> {
    return this.http.get<any>(
      `${Envs.apiUrl}Candidatos/ValidarToken?token=${token}`,
      { headers: this.headers }
    );
  }
  cadastrarCandidato(
    candidato: CandidatoInterface,
    token: string
  ): Observable<CandidatoInterface> {
    return this.http.post<CandidatoInterface>(
      `${Envs.apiUrl}Candidatos/CadastrarCandidato?token=${token}`,
      candidato,
      { headers: this.headers }
    );
  }
  cadastrarFamiliar(
    familiar: FamiliaresInterface
  ): Observable<FamiliaresInterface> {
    return this.http.post<FamiliaresInterface>(
      `${Envs.apiUrl}Usuarios/CadastrarFamiliar`,
      familiar,
      { headers: this.headers }
    );
  }
  verCandidatos(): Observable<CandidatoInterface[]> {
    return this.http.get<CandidatoInterface[]>(
      `${Envs.apiUrl}Candidatos/VerCandidatos`,
      { headers: this.headers }
    );
  }
  verCandidato(id: number): Observable<CandidatoInterface> {
    return this.http.get<CandidatoInterface>(
      `${Envs.apiUrl}Candidatos/VerCandidato?id=${id}`,
      { headers: this.headers }
    );
  }
  baixarFichaCandidato(id: number, idade: number): Observable<any> {
    return this.http.get<any>(
      `${Envs.apiUrl}Candidatos/FichaCandidato?id=${id}&idade=${idade}`,
      { headers: this.headers3 }
    );
  }
  baixarFichaMacom(id: number, idade: number): Observable<any> {
    return this.http.get<any>(
      `${Envs.apiUrl}Usuarios/FichaMacom?id=${id}&idade=${idade}`,
      { headers: this.headers }
    );
  }
  gerarCarteirinha(id: number): Observable<any> {
    return this.http.get<any>(`${Envs.apiUrl}Usuarios/Carteirinha?id=${id}`, {
      headers: this.headers,
    });
  }
  verAniversarios(): Observable<UsuariosInterface[]> {
    return this.http.get<UsuariosInterface[]>(
      `${Envs.apiUrl}Usuarios/VerAniversarios`,
      { headers: this.headers }
    );
  }
  verAniversariosFamilia(): Observable<NiverFamiliaInterface[]> {
    return this.http.get<NiverFamiliaInterface[]>(
      `${Envs.apiUrl}Usuarios/VerNiverFamilia`,
      { headers: this.headers }
    );
  }
}
