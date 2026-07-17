import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Envs } from './envs';
import { ComunicadoInterface } from '../interfaces/comunicados';

@Injectable({
  providedIn: 'root'
})
export class ComunicadosService {

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<ComunicadoInterface[]> {
    return this.http.get<ComunicadoInterface[]>(
      `${Envs.apiUrl}Comunicados/ListarTodos`
    );
  }

  listarPorGrau(grau: string): Observable<ComunicadoInterface[]> {
    return this.http.get<ComunicadoInterface[]>(
      `${Envs.apiUrl}Comunicados/ListarPorGrau?grau=${grau}`
    );
  }

  listarRecentes(quantidade: number = 5): Observable<ComunicadoInterface[]> {
    return this.http.get<ComunicadoInterface[]>(
      `${Envs.apiUrl}Comunicados/ListarRecentes?quantidade=${quantidade}`
    );
  }

  verComunicado(id: number): Observable<ComunicadoInterface> {
    return this.http.get<ComunicadoInterface>(
      `${Envs.apiUrl}Comunicados/VerComunicado?id=${id}`
    );
  }

  gravarComunicado(comunicado: ComunicadoInterface): Observable<ComunicadoInterface> {
    return this.http.post<ComunicadoInterface>(
      `${Envs.apiUrl}Comunicados/CadastrarComunicado`,
      comunicado
    );
  }

  atualizarComunicado(comunicado: ComunicadoInterface): Observable<ComunicadoInterface> {
    return this.http.put<ComunicadoInterface>(
      `${Envs.apiUrl}Comunicados/AtualizarComunicado`,
      comunicado
    );
  }

  deletarComunicado(id: number): Observable<any> {
    return this.http.delete<any>(
      `${Envs.apiUrl}Comunicados/DeletarComunicado?id=${id}`
    );
  }
}
