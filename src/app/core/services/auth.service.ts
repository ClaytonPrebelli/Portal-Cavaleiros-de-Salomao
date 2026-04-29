import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Envs } from './envs';
import { 
  FamiliaresInterface, 
  LoginParams, 
  LoginResponse, 
  NiverFamiliaInterface, 
  UsuariosInterface 
} from '../interfaces/login';
import { StatusInterface } from '../interfaces/status';
import { CandidatoInterface } from '../interfaces/candidato';
import { PaginatorInterface } from '../interfaces/paginator';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(login: LoginParams): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${Envs.apiUrl}Usuarios/Login`,
      login
    );
  }

  verificaAtivo(id: number): Observable<LoginResponse> {
    return this.http.get<LoginResponse>(
      `${Envs.apiUrl}Usuarios/VerificaAtivo/?id=${id}`
    );
  }

  listarMacons(
    page?: number,
    loja?: number,
    status?: number,
    termo?: string
  ): Observable<PaginatorInterface> {
    return this.http.get<PaginatorInterface>(
      `${Envs.apiUrl}Usuarios/ListarUsuarios?page=${page}&loja=${loja}&status=${status}&termo=${termo}`
    );
  }

  listarStatus(): Observable<StatusInterface[]> {
    return this.http.get<StatusInterface[]>(
      `${Envs.apiUrl}Usuarios/VerStatus`
    );
  }

  cadastrarMacom(macom: UsuariosInterface): Observable<UsuariosInterface> {
    return this.http.post<UsuariosInterface>(
      `${Envs.apiUrl}Usuarios/CadastrarUsuario`,
      macom
    );
  }

  gravarFotoIUser(foto: File, id: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', foto);
    return this.http.post<any>(
      `${Envs.apiUrl}Fotos/GravarFotoUser?id=${id}`,
      formData
    );
  }

  verMacom(id: number | any): Observable<UsuariosInterface> {
    return this.http.get<UsuariosInterface>(
      `${Envs.apiUrl}Usuarios/VerUsuario?id=${id}`
    );
  }

  gerarToken(id: number): Observable<any> {
    return this.http.get<any>(
      `${Envs.apiUrl}Candidatos/GerarTokenCandidato?id=${id}`
    );
  }

  validaToken(token: string): Observable<any> {
    return this.http.get<any>(
      `${Envs.apiUrl}Candidatos/ValidarToken?token=${token}`
    );
  }

  cadastrarCandidato(
    candidato: CandidatoInterface,
    token: string
  ): Observable<CandidatoInterface> {
    return this.http.post<CandidatoInterface>(
      `${Envs.apiUrl}Candidatos/CadastrarCandidato?token=${token}`,
      candidato
    );
  }

  cadastrarFamiliar(
    familiar: FamiliaresInterface
  ): Observable<FamiliaresInterface> {
    return this.http.post<FamiliaresInterface>(
      `${Envs.apiUrl}Usuarios/CadastrarFamiliar`,
      familiar
    );
  }

  verCandidatos(): Observable<CandidatoInterface[]> {
    return this.http.get<CandidatoInterface[]>(
      `${Envs.apiUrl}Candidatos/VerCandidatos`
    );
  }

  verCandidato(id: number): Observable<CandidatoInterface> {
    return this.http.get<CandidatoInterface>(
      `${Envs.apiUrl}Candidatos/VerCandidato?id=${id}`
    );
  }

  baixarFichaCandidato(id: number, idade: number): Observable<Blob> {
    return this.http.get(
      `${Envs.apiUrl}Candidatos/FichaCandidato?id=${id}&idade=${idade}`,
      { responseType: 'blob' }
    );
  }

  baixarFichaMacom(id: number, idade: number): Observable<Blob> {
    return this.http.get(
      `${Envs.apiUrl}Usuarios/FichaMacom?id=${id}&idade=${idade}`,
      { responseType: 'blob' }
    );
  }

  gerarCarteirinha(id: number): Observable<Blob> {
    return this.http.get(
      `${Envs.apiUrl}Usuarios/Carteirinha?id=${id}`,
      { responseType: 'blob' }
    );
  }

  verAniversarios(): Observable<UsuariosInterface[]> {
    return this.http.get<UsuariosInterface[]>(
      `${Envs.apiUrl}Usuarios/VerAniversarios`
    );
  }

  verAniversariosFamilia(): Observable<NiverFamiliaInterface[]> {
    return this.http.get<NiverFamiliaInterface[]>(
      `${Envs.apiUrl}Usuarios/VerNiverFamilia`
    );
  }
}
