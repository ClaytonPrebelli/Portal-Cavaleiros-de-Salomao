import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Envs } from './envs';
import { FinanceiroInterface, CategoriaFinanceiroInterface } from '../interfaces/financeiro';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {

  constructor(private http: HttpClient) {}

  listarTodos(mes?: number, ano?: number, tipo?: string, pago?: boolean): Observable<FinanceiroInterface[]> {
    let url = `${Envs.apiUrl}Financeiro/ListarTodos`;
    const params: string[] = [];
    if (mes) params.push(`mes=${mes}`);
    if (ano) params.push(`ano=${ano}`);
    if (tipo) params.push(`tipo=${tipo}`);
    if (pago !== undefined) params.push(`pago=${pago}`);
    if (params.length) url += '?' + params.join('&');
    return this.http.get<FinanceiroInterface[]>(url);
  }

  listarEntradas(mes?: number, ano?: number, categoriaId?: number): Observable<FinanceiroInterface[]> {
    let url = `${Envs.apiUrl}Financeiro/ListarEntradas`;
    const params: string[] = [];
    if (mes) params.push(`mes=${mes}`);
    if (ano) params.push(`ano=${ano}`);
    if (categoriaId) params.push(`categoriaId=${categoriaId}`);
    if (params.length) url += '?' + params.join('&');
    return this.http.get<FinanceiroInterface[]>(url);
  }

  listarSaidas(mes?: number, ano?: number, categoriaId?: number): Observable<FinanceiroInterface[]> {
    let url = `${Envs.apiUrl}Financeiro/ListarSaidas`;
    const params: string[] = [];
    if (mes) params.push(`mes=${mes}`);
    if (ano) params.push(`ano=${ano}`);
    if (categoriaId) params.push(`categoriaId=${categoriaId}`);
    if (params.length) url += '?' + params.join('&');
    return this.http.get<FinanceiroInterface[]>(url);
  }

  obterSaldo(mes?: number, ano?: number): Observable<{ saldo: number }> {
    let url = `${Envs.apiUrl}Financeiro/ObterSaldo`;
    const params: string[] = [];
    if (mes) params.push(`mes=${mes}`);
    if (ano) params.push(`ano=${ano}`);
    if (params.length) url += '?' + params.join('&');
    return this.http.get<{ saldo: number }>(url);
  }

  verLancamento(id: number): Observable<FinanceiroInterface> {
    return this.http.get<FinanceiroInterface>(
      `${Envs.apiUrl}Financeiro/VerLancamento?id=${id}`
    );
  }

  cadastrar(lancamento: FinanceiroInterface): Observable<FinanceiroInterface> {
    const endpoint = lancamento.tipo === 'Saida' ? 'CadastrarSaida' : 'CadastrarEntrada';
    return this.http.post<FinanceiroInterface>(
      `${Envs.apiUrl}Financeiro/${endpoint}`,
      lancamento
    );
  }

  atualizar(lancamento: FinanceiroInterface): Observable<FinanceiroInterface> {
    return this.http.put<FinanceiroInterface>(
      `${Envs.apiUrl}Financeiro/AtualizarLancamento`,
      lancamento
    );
  }

  deletar(id: number): Observable<any> {
    return this.http.delete<any>(
      `${Envs.apiUrl}Financeiro/DeletarLancamento?id=${id}`
    );
  }

  marcarComoPago(id: number, dataPagamento: string): Observable<any> {
    return this.http.put<any>(
      `${Envs.apiUrl}Financeiro/MarcarComoPago?id=${id}&dataPagamento=${dataPagamento}`,
      {}
    );
  }

  listarCategorias(tipo?: string): Observable<CategoriaFinanceiroInterface[]> {
    let url = `${Envs.apiUrl}Financeiro/ListarCategorias`;
    if (tipo) url += `?tipo=${tipo}`;
    return this.http.get<CategoriaFinanceiroInterface[]>(url);
  }
}
