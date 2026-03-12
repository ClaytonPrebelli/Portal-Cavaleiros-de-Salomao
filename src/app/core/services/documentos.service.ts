import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentosInterface, DocumentosResponse } from '../interfaces/documentos';
import { Envs } from './envs';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  constructor(private http :HttpClient) { }
  headers = new HttpHeaders()
  .append('Access-Control-Allow-Origin', '*')
  .append('Access-Control-Allow-Headers', '*')
  .append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  .append('mode', 'no-cors')


  verDocumentosUsuario(id:any):Observable<DocumentosResponse[]>{
    return this.http.get<DocumentosResponse[]>(`${Envs.apiUrl}Documentos/VerDocumentosUsuario?id=${id}`,{headers:this.headers})
  }
  enviarDocumentoUsuario(foto:File,id:any):Observable<any>{
    const formData = new FormData();
    formData.append('file',foto);
    return this.http.post<any>(`${Envs.apiUrl}Documentos/CadastrarDocumentoUsuario?id=${id}`,formData,{headers:this.headers})
  }

}
