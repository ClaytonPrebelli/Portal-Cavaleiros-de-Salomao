import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LivrosInterface } from '../interfaces/livros';
import { Envs } from './envs';

@Injectable({
  providedIn: 'root'
})
export class LivrosService {


  constructor(private http :HttpClient) { }
  headers = new HttpHeaders()
  .append('Access-Control-Allow-Origin', '*')
  .append('Access-Control-Allow-Headers', '*')
  .append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  .append('mode', 'no-cors')
 

  verLivrosAprendiz():Observable<LivrosInterface[]>{
    return this.http.get<LivrosInterface[]>(`${Envs.apiUrl}Livros/VerLivrosAprendiz`,{headers:this.headers})
  }
  verLivrosCompanheiro():Observable<LivrosInterface[]>{
    return this.http.get<LivrosInterface[]>(`${Envs.apiUrl}Livros/VerLivrosCompanheiro`,{headers:this.headers})
  }
  verLivrosMestre():Observable<LivrosInterface[]>{
    return this.http.get<LivrosInterface[]>(`${Envs.apiUrl}Livros/VerLivrosMestre`,{headers:this.headers})
  }
}
