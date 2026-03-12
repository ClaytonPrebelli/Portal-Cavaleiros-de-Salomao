import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LojasInterface } from './../interfaces/lojas';
import { Envs } from './envs';
import { FotoInterface } from '../interfaces/foto';

@Injectable({
  providedIn: 'root'
})
export class LojasService {

  constructor(private http :HttpClient) { }
  headers = new HttpHeaders()
  .append('Access-Control-Allow-Origin', '*')
  .append('Access-Control-Allow-Headers', '*')
  .append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  .append('mode', 'no-cors')


  verLojasAtivas():Observable<LojasInterface[]>{
    return this.http.get<LojasInterface[]>(`${Envs.apiUrl}Lojas/VerLojasAtivas`,{headers:this.headers})
  }

}
