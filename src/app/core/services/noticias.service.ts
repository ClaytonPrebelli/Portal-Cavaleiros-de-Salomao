import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Envs } from './envs';
import { NoticiasInterface, NoticiasResponse } from '../interfaces/noticias';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  constructor(private http: HttpClient) { }

  listarNoticias(page: number, pageSize: number): Observable<NoticiasResponse> {
    return this.http.get<NoticiasResponse>(
      `${Envs.apiUrl}Noticias/ListarNoticias?page=${page}&pageSize=${pageSize}`
    );
  }

  verNoticia(id: number): Observable<NoticiasInterface> {
    return this.http.get<NoticiasInterface>(
      `${Envs.apiUrl}Noticias/VerNoticia?id=${id}`
    );
  }

  gravarNoticia(noticia: NoticiasInterface): Observable<NoticiasInterface> {
    return this.http.post<NoticiasInterface>(
      `${Envs.apiUrl}Noticias/CadastrarNoticia`,
      noticia
    );
  }

  gravarFotoNoticia(foto: File, id: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', foto);
    return this.http.post<any>(
      `${Envs.apiUrl}Fotos/GravarFotoNoticias?id=${id}`,
      formData
    );
  }
}
