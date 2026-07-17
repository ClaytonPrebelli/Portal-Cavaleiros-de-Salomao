import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LivrosInterface } from '../interfaces/livros';
import { Envs } from './envs';

@Injectable({
  providedIn: 'root'
})
export class LivrosService {


  constructor(private http :HttpClient) { }

  verLivrosAprendiz():Observable<LivrosInterface[]>{
    return this.http.get<LivrosInterface[]>(`${Envs.apiUrl}Livros/VerLivrosAprendiz`)
  }
  verLivrosCompanheiro():Observable<LivrosInterface[]>{
    return this.http.get<LivrosInterface[]>(`${Envs.apiUrl}Livros/VerLivrosCompanheiro`)
  }
  verLivrosMestre():Observable<LivrosInterface[]>{
    return this.http.get<LivrosInterface[]>(`${Envs.apiUrl}Livros/VerLivrosMestre`)
  }
}
