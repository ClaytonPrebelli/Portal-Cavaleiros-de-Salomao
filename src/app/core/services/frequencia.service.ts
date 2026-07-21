import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Envs } from './envs';
import { FrequenciaInterface, FrequenciaHistoricoInterface } from '../interfaces/frequencia';

@Injectable({
  providedIn: 'root'
})
export class FrequenciaService {

  constructor(private http: HttpClient) {}

  listarPorData(dataReuniao: string): Observable<FrequenciaInterface[]> {
    return this.http.get<FrequenciaInterface[]>(
      `${Envs.apiUrl}Frequencia/ListarPorData?dataReuniao=${dataReuniao}`
    );
  }

  listarPorMembro(usuarioId: number): Observable<FrequenciaInterface[]> {
    return this.http.get<FrequenciaInterface[]>(
      `${Envs.apiUrl}Frequencia/ListarPorMembro?usuarioId=${usuarioId}`
    );
  }

  listarTodas(mes?: number, ano?: number): Observable<FrequenciaInterface[]> {
    let url = `${Envs.apiUrl}Frequencia/ListarTodas`;
    const params: string[] = [];
    if (mes) params.push(`mes=${mes}`);
    if (ano) params.push(`ano=${ano}`);
    if (params.length) url += '?' + params.join('&');
    return this.http.get<FrequenciaInterface[]>(url);
  }

  togglePresenca(usuarioId: number, dataReuniao: string): Observable<{ presente: boolean }> {
    return this.http.put<{ presente: boolean }>(
      `${Envs.apiUrl}Frequencia/TogglePresenca?usuarioId=${usuarioId}&dataReuniao=${dataReuniao}`,
      {}
    );
  }

  salvarLista(lista: FrequenciaInterface[]): Observable<FrequenciaInterface[]> {
    return this.http.post<FrequenciaInterface[]>(
      `${Envs.apiUrl}Frequencia/SalvarLista`,
      lista
    );
  }

  deletarPresenca(id: number): Observable<any> {
    return this.http.delete<any>(
      `${Envs.apiUrl}Frequencia/DeletarPresenca?id=${id}`
    );
  }

  listarDatasReuniao(mes: number, ano: number): Observable<string[]> {
    return this.http.get<string[]>(
      `${Envs.apiUrl}Frequencia/ListarDatasReuniao?mes=${mes}&ano=${ano}`
    );
  }

  listarHistorico(dataInicio: string, dataFim: string): Observable<FrequenciaHistoricoInterface[]> {
    return this.http.get<FrequenciaHistoricoInterface[]>(
      `${Envs.apiUrl}Frequencia/ListarHistorico?dataInicio=${dataInicio}&dataFim=${dataFim}`
    );
  }
}
