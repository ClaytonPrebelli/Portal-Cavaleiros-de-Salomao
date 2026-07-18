import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Envs } from './envs';
import { CobrancaInterface } from '../interfaces/login';

@Injectable({
  providedIn: 'root'
})
export class CobrancasService {

  constructor(private http: HttpClient) {}

  listarTodas(categoriaId?: number, paga?: boolean): Observable<CobrancaInterface[]> {
    let url = `${Envs.apiUrl}Cobrancas/ListarTodas`;
    const params: string[] = [];
    if (categoriaId) params.push(`categoriaId=${categoriaId}`);
    if (paga !== undefined) params.push(`paga=${paga}`);
    if (params.length) url += '?' + params.join('&');
    return this.http.get<CobrancaInterface[]>(url);
  }

  listarPorMembro(usuarioId: number): Observable<CobrancaInterface[]> {
    return this.http.get<CobrancaInterface[]>(
      `${Envs.apiUrl}Cobrancas/ListarPorMembro?usuarioId=${usuarioId}`
    );
  }

  verCobranca(id: number): Observable<CobrancaInterface> {
    return this.http.get<CobrancaInterface>(
      `${Envs.apiUrl}Cobrancas/VerCobranca?id=${id}`
    );
  }

  cadastrar(cobranca: CobrancaInterface): Observable<CobrancaInterface> {
    return this.http.post<CobrancaInterface>(
      `${Envs.apiUrl}Cobrancas/CadastrarCobranca`,
      cobranca
    );
  }

  atualizar(cobranca: CobrancaInterface): Observable<CobrancaInterface> {
    return this.http.put<CobrancaInterface>(
      `${Envs.apiUrl}Cobrancas/AtualizarCobranca`,
      cobranca
    );
  }

  marcarComoPaga(id: number, dataPagamento: string): Observable<any> {
    return this.http.put<any>(
      `${Envs.apiUrl}Cobrancas/MarcarComoPaga?id=${id}&dataPagamento=${dataPagamento}`,
      {}
    );
  }

  deletar(id: number): Observable<any> {
    return this.http.delete<any>(
      `${Envs.apiUrl}Cobrancas/DeletarCobranca?id=${id}`
    );
  }

  listarCategorias(): Observable<any[]> {
    return this.http.get<any[]>(
      `${Envs.apiUrl}Cobrancas/ListarCategorias`
    );
  }
}
