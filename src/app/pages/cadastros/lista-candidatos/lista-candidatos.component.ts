import { Component, NgModule, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CandidatoInterface } from 'src/app/core/interfaces/candidato';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-lista-candidatos',
  templateUrl: './lista-candidatos.component.html',
  styleUrls: ['./lista-candidatos.component.scss']
})
export class ListaCandidatosComponent implements OnInit{
  busy=false;
  mobile=false
  listaCandidatos:CandidatoInterface[]=[]
  dataSource = new MatTableDataSource<CandidatoInterface>(this.listaCandidatos);
  displayedColumns: string[] = ['indice','nome','status','acoes'];
  constructor(private service:AuthService){}
  ngOnInit(){
    this.busy=true
    var largura = window.innerWidth
    if(largura<1240){
      this.displayedColumns = ['nome','status','acoes'];
    }
    this.service.verCandidatos().subscribe(data=>{
      this.listaCandidatos = data
      this.dataSource.data = this.listaCandidatos
      this.busy = false
    })
  }
}
